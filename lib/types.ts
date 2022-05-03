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

export type Middleware = (request: Request, params: Record<string, any>) => any
export type Handler = (request: Request, params: Record<string, any>) => Response | Promise<Response>

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

export type CustomTag = `<${string}>`
export type CustomTags = (request?: Request, params?: Record<string, any>) => Record<string, CustomTag>
export type Template = (ssrResult: string, customTags?: Record<string, CustomTag>, request?: Request) => string
export type Render = (app: any, request: Request, params: Record<string, any>) => string | Promise<string>

export type SSRRoute = { 
    route: string
    middleware?: Middleware
    template: Template
    render: Render
    moduleURL: URL
    customTags?: CustomTags
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