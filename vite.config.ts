import { cloudflare } from "@cloudflare/vite-plugin";
import vinext from "vinext";
import { defineConfig } from "vite";

// Standard vinext-on-Cloudflare-Workers setup. Bindings (D1) and vars live in
// wrangler.jsonc; secrets come from `.dev.vars` locally and `wrangler secret put`
// in production.
export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      inspectorPort: false,
      config: { main: "vinext/server/fetch-handler" },
    }),
  ],
});
