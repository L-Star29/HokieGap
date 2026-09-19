# A clear 90-second demo

1. Start with the real problem: “My ECE class ends at 9:55, my next class in Derring starts at 11:15. I have 80 minutes, but I waste some of it finding somewhere nearby to sit.”
2. Click ECE example. Show that the app uses both the current and next building, including walking and an arrival buffer. It is about usable time in a gap, not just the nearest building.
3. Compare NCB to Cowgill. Open the NCB plan to show a class-change warning during the stay, grounded in public class schedules and section capacity. Say explicitly: “This is our transparent initial heuristic, not a validated occupancy prediction.”
4. Choose another space as a backup. Change to published opening hours only to show that known closure and unknown access are treated differently.
5. Explain recent reports: a student physically present can report plenty/few/no seats. A real observation is shared and expires after 15 minutes. Do not submit a fabricated report on the live site for the demo. Use a disposable local instance if demonstrating simulated conditions, and say they are simulated.
6. Close with the evidence gap: “The planner works now. Next we need repeated seating observations to test whether class-change features improve the decisions, and to train a model only if the evidence supports it.”

## What to do next

No personal classroom details are required. Try the app with another student using their own two buildings. Observe whether they can choose a useful spot and understand the uncertainty. A short conversation is enough for initial testing; a form is optional.

For a quick field check, verify NCB alcoves, Cowgill library and Goodwin common spaces: accessible entrance, practical walking time, available seating and current access. Note whether the app's top recommendation is somewhere they would actually go. This improves reliability more than collecting broad feature requests.

Before the submission, connect sponsor services deliberately: use Databricks for documented ingestion and forecast analysis; Gemini for explanations grounded only in the selected plan and verified place data; HokieAI only if its actual challenge requirements support a useful integration. These are unfinished, not claimed features. Do not expose credentials in chat or browser code. Recheck the current track requirements and entry limits before claiming eligibility.

The prototype is focused on nearby study/break spaces. Dining, dorm trips, transit prediction and automatic calendar imports remain outside this build.
