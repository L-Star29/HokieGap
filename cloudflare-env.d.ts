declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    // Secrets (wrangler secret put / .dev.vars)
    GEMINI_API_KEY?: string;
    DATABRICKS_TOKEN?: string;
    // Plain vars (wrangler.jsonc "vars")
    AGENT_ENABLED?: string;
    GEMINI_MODEL?: string;
    DATABRICKS_HOST?: string;
    DATABRICKS_WAREHOUSE_ID?: string;
    DATABRICKS_CATALOG?: string;
    DATABRICKS_SCHEMA?: string;
  }
}
