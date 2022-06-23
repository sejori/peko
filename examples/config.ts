import { Config } from "../mod.ts" // <- https://deno.land/x/peko/mod.ts

const env = Deno.env.toObject()

// EXAMPLE CONFIG
//
const config: Partial<Config> = {
  // host set-up (same as default)
  port: 7777,
  hostname: "0.0.0.0",

  // devMode true enables hot-reload events in ssrHandler and disables cacher middleware
  devMode: env.ENVIRONMENT !== "production",

  // handle internally-generated log strings and events 
  // logString: (s) => console.log(s), <-- default
  logEvent: () => {}, // <-- ingore event logs for clean shell

  // Set custom responses for errors thrown by Peko internals
  // handleError: (_ctx, _status) => new Response("Uh-oh! Something went wrong...")
}

export default config