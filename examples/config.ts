import { Config } from "../lib/types.ts"

const env = Deno.env.toObject()

// CUSTOM CONFIG FOR EXAMPLES
// Missing attributes fallback to default values (see lib/config.ts)
//
const config: Partial<Config> = {
    // host set-up (same as default)
    port: 7777,
    hostname: "0.0.0.0",

    // devMode true disables catching in addStaticRoute & addSSRRoute fcns
    // TODO: implement hot-reloading SSE in devMode
    devMode: env.ENVIRONMENT !== "production",

    // handle internally-generated log strings (same as default)
    // Note: it is recommended to POST these to a logging service or db record
    logString: (s) => console.log(s),

    // handle internally-generated event objects
    // Note: it is recommended to POST these to an analytics service or db record
    //
    // Use commented default value below to see event data in console:
    // logEvent: (data) => console.log(JSON.stringify(data)),
    logEvent: (e) => console.log(e),

    // custom error handling function
    // Note: must return a valid Response object
    errorHandler: (statusCode, _request, _error) => {
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