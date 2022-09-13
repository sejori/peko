import {
  logger,
  Event
} from "../mod.ts" // <- https://deno.land/x/peko/middleware/mod.ts 

const config = {
  globalMiddleware: [
    logger
  ],
  // eventLogger: (event: Event) => console.log(event.data.response), 
  eventLogger: () => {} // <-- ingore event logs for clean shell
}

export default config