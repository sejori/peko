import { Config } from "../mod.ts" // <- https://deno.land/x/peko/mod.ts

const env = Deno.env.toObject()

// EXAMPLE CONFIG
//
const config: Partial<Config> = {
  // host set-up (same as default)
  port: 7777,
  hostname: "0.0.0.0",

  // devMode true disables catching in addStaticRoute & addSSRRoute fcns
  devMode: env.ENVIRONMENT !== "production",

  // handle internally-generated log strings (same as default)
  logString: (s) => console.log(s),

  // handle internally-generated event objects
  logEvent: (e) => console.log(e),

  // handle errors thrown by Peko internals
  handleError: (_ctx, statusCode) => {
    let response;
    switch (statusCode) {
      case 404: 
        response = new Response("404: Nothing found here!", {
          headers: new Headers(),
          status: 404
        })
        break
      default:
        response = new Response("500: Internal Server Error!", {
          headers: new Headers(),
          status: 500
        })
        break
    }
    return response
  }
}

export default config