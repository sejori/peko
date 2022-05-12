export type LogString = (log: string) => void | Promise<void>
export type LogEvent = (data: RequestEvent) => void | Promise<void>
export type ErrorHandler = (statusCode: number, request?: Request, error?: Error) => Response | Promise<Response>

export type Config = { 
    devMode: boolean
    port: number
    hostname: string
    defaultCacheLifetime: number
    logString: LogString
    logEvent: LogEvent
    errorHandler: ErrorHandler
}

export type HandlerParams = Record<string, string>
export type Middleware = (request: Request) => HandlerParams
export type Handler = (request: Request, params: HandlerParams) => Response | Promise<Response>

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

export type HTMLContent = `<${string}>`
export type Template = (ssrResult: HTMLContent, request: Request, params: HandlerParams) => string
export type Render = (app: Function, request: Request, params: HandlerParams) => HTMLContent | Promise<HTMLContent>

export type SSRRoute = { 
    route: string
    module: {
        srcURL?: URL
        app?: Function
    }
    middleware?: Middleware
    template: Template
    render: Render
    cacheLifetime?: number
}

export type RequestEvent = {
    date: string
    status: number
    method: string
    url: string
    responseTime: string
    headers: Record<string, string>
}