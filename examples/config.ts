const env = Deno.env.toObject()

const config = {
  // set devMode true to disable caching and enable route testing and hot-reload events from ssrHandler
  devMode: env.ENVIRONMENT !== "production",
  // devMode: false,

  eventLogger: () => {}, // <-- ingore event logs for clean shell
}

export default config