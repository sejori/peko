import {
  logger,
  Event
} from "../mod.ts"      // <- https://deno.land/x/peko/middleware/mod.ts 

const config = {
  globalMiddleware: [
    // log requests and events  
    logger              
  ],
  // ingore non-error event logs for clean shell. 
  eventLogger: (event: Event) => { if (event.type === "error") console.log(event) }
}

export default config