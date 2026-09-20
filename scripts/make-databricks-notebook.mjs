import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const data=Object.fromEntries(['buildings','spaces','classes','hours'].map(k=>[k,JSON.parse(readFileSync(new URL(`../data/${k}.json`,import.meta.url),'utf8'))]));
const payload=Buffer.from(JSON.stringify(data)).toString('base64');

// Python cell run on Databricks serverless compute. Explicit schemas are required:
// `enrollment` is null in every public timetable row, and Spark cannot infer a type
// for an all-null column (createDataFrame would raise CANNOT_DETERMINE_TYPE).
const code=String.raw`import base64, json, re
from pyspark.sql.types import (StructType, StructField, StringType, IntegerType,
                               DoubleType, BooleanType, ArrayType)

# Select a catalog you can write to. Only the hokiegap schema is touched.
CATALOG = "workspace"
SCHEMA = "hokiegap"
assert all(re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", x) for x in [CATALOG, SCHEMA])
root = f"{CATALOG}.{SCHEMA}"
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {root}")
data = json.loads(base64.b64decode("${payload}"))

# 1) The table the HokieGap agent queries (name, JSON payload). The app reads
#    exactly these four rows through the Databricks SQL Statement API.
rows = [(name, json.dumps(value)) for name, value in data.items()]
spark.createDataFrame(rows, "name string, payload string").write.mode("overwrite").saveAsTable(f"{root}.campus_datasets")

# 2) Typed tables for exploration, dashboards and judging.
S, I, D, B = StringType(), IntegerType(), DoubleType(), BooleanType()
classes_schema = StructType([StructField(n, t, True) for n, t in [
    ("crn", S), ("course", S), ("building_id", S), ("room", S), ("days", S),
    ("start_min", I), ("end_min", I), ("capacity", I), ("enrollment", I)]])
spark.createDataFrame(
    [(c["crn"], c["course"], c["buildingId"], c["room"], c["days"],
      c["start"], c["end"], c["capacity"], c.get("enrollment")) for c in data["classes"]],
    classes_schema).write.mode("overwrite").saveAsTable(f"{root}.scheduled_classes")

buildings_schema = StructType([StructField(n, t, True) for n, t in [
    ("id", S), ("name", S), ("lat", D), ("lon", D), ("source", S), ("checked_at", S)]])
spark.createDataFrame(
    [(b["id"], b["name"], float(b["lat"]), float(b["lon"]), b["source"], b["checkedAt"]) for b in data["buildings"]],
    buildings_schema).write.mode("overwrite").saveAsTable(f"{root}.buildings")

spaces_schema = StructType([StructField(n, t, True) for n, t in [
    ("id", S), ("building_id", S), ("name", S), ("location", S), ("intents", ArrayType(S)),
    ("note", S), ("verification", S), ("source", S), ("hours_key", S), ("historic", B)]])
spark.createDataFrame(
    [(s["id"], s["buildingId"], s["name"], s["location"], list(s["intents"]), s["note"],
      s["verification"], s["source"], s.get("hoursKey"), bool(s["historic"])) for s in data["spaces"]],
    spaces_schema).write.mode("overwrite").saveAsTable(f"{root}.spaces")

# 3) A Databricks-side aggregate: scheduled section load per building.
spark.sql(f"""
CREATE OR REPLACE VIEW {root}.building_class_load AS
SELECT building_id,
       COUNT(*)      AS scheduled_sections,
       SUM(capacity) AS section_capacity_sum
FROM {root}.scheduled_classes
GROUP BY building_id
""")

# 4) Verify what the app will read.
check = spark.sql(f"SELECT name, length(payload) AS payload_chars FROM {root}.campus_datasets ORDER BY name")
display(check)
assert check.count() == 4, "campus_datasets must contain buildings, spaces, classes and hours"
display(spark.sql(f"SELECT * FROM {root}.building_class_load ORDER BY scheduled_sections DESC"))
print("Loaded", root, "-", len(data["classes"]), "class meetings")
print("Capacity sums are not enrollment, attendance, or occupancy.")
`;

const notebook={nbformat:4,nbformat_minor:5,metadata:{language_info:{name:'python'},kernelspec:{display_name:'Python 3',language:'python',name:'python3'}},cells:[
 {cell_type:'markdown',metadata:{},source:['# HokieGap campus data\n','Run this notebook on Databricks serverless compute (Run all). It writes only the selected catalog’s hokiegap schema. Re-running replaces HokieGap snapshot tables. Data sources and limits are in docs/DATA.md. No private roster or credentials are included.\n'],id:'intro'},
 {cell_type:'code',execution_count:null,metadata:{},outputs:[],source:code.split(/(?<=\n)/),id:'load-campus'}]};
mkdirSync(new URL('../databricks/',import.meta.url),{recursive:true});
writeFileSync(new URL('../databricks/01_load_campus.ipynb',import.meta.url),JSON.stringify(notebook,null,2));
console.log('Created databricks/01_load_campus.ipynb with public campus data only.');
