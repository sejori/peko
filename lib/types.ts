export type HandlerParams = Record<string, string>
export type Middleware = () => void | string| HandlerParams | Promise<void> | Promise<string> | Promise<HandlerParams>
export type Handler = (request: Request, params: HandlerParams) => Response | Promise<Response>

// TODO: test route strings for formatting to enforce type `/${string}` in devMode
export type Route = { 
  route: string
  method: string
  middleware?: Middleware
  handler: Handler
}

export type StaticRoute = { 
  route: string
  middleware?: Middleware
  fileURL: URL
  contentType: string | undefined
}

// TODO: angle bracket HTMLContent type should be moved out of types and into a unit test
// it is too specific as a type and will break integrations with libraries (e.g. eta)
// export type HTMLContent = `<${string}>`
export type HTMLContent = string
export type Render = (request: Request, params: HandlerParams) => HTMLContent | Promise<HTMLContent>

export type SSRRoute = { 
  route: string
  srcURL?: URL
  middleware?: Middleware
  render: Render
  cacheLifetime?: number
}

export type SSERoute = {
  route: string
  emitter: Emitter
}

export type Listener = (e: Event) => void | Promise<void>
export type Emitter = {
  emit: (e: Event) => void | void[] | Promise<void | void[]>
  subscribe: (cb: Listener) => boolean
  unsubscribe: (cb: Listener) => boolean
  getListeners: () => Listener[]
}

export type Event = {
  id: string
  type: "request" | "emit" | "error"
  date: Date
  data: Record<string, string>
  // data: Record<string, string | number | Request | Error | Record<string, string>>
}