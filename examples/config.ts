import {
  logger,
  // Event
} from "../mod.ts"      // <- https://deno.land/x/peko/middleware/mod.ts 

const config = {
  globalMiddleware: [
    // log requests and events  
    logger              
  ],
  // ingore event logs for clean shell. 
  // eventLogger: () => {}
  // For debugging try:
  // eventLogger: (event: Event) => console.log(event.data.response), 
}

export default config