import { Config } from "../lib/types.ts"

// CUSTOM CONFIG FOR EXAMPLES
// Missing attributes fallback to default values (see lib/config.ts)
//
const config: Partial<Config> = {
    // host set-up (same as default)
    port: 7777,
    hostname: "0.0.0.0",

    devMode: false,

    // default ssr cache lifetime (ms - same as default)
    defaultCacheLifetime: 6000,

    // handle internally-generated log strings (same as default)
    // Note: it is recommended to POST these to a logging service or db record
    logString: (log) => console.log(log),

    // handle internally-generated event objects
    // Note: it is recommended to POST these to an analytics service or db record
    //
    // Use commented default value below to see event data in console:
    // logEvent: (data) => console.log(JSON.stringify(data)),
    logEvent: (_data) => {},

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