import { logger } from "../mod.ts" // <- https://deno.land/x/peko/server.ts 

const config = {
  globalMiddleware: [
    logger 
    // ^ log requests
  ],
  //
  // You can send logs to a custom service like so:
  //
  // stringLogger: (s: string) => {
  //   fetch("https://loggingservice.net", { 
  //     method: "POST", 
  //     body: s 
  //   })
  // },
  eventLogger: () => {}, // <-- ingore event logs for clean shell
}

export default config