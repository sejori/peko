export type Config = { 
    devMode: boolean,
    port: number, 
    hostname: string, 
    defaultCacheLifetime: number, 
    logString: (log: string) => void | Promise<void>, 
    logEvent: (data: RequestEvent) => void | Promise<void>,
    errorHandler: (statusCode: number, request?: Request, error?: Error) => Response | Promise<Response>
}

export type Middleware = (request: Request, params: Record<string, any>) => void | Promise<void> | Request | Promise<Request>
export type Route = { 
    route: string, 
    method: string, 
    middleware?: Middleware
    handler: (request: Request, params: Record<string, any>) => Response | Promise<Response>
}

export type CustomTag = `<${string}>`
export type SSRRoute = { 
    route: string,
    middleware?: Middleware
    template: (htmlContent: string, customTags?: Record<string, CustomTag>, request?: Request) => string,
    render: (app: any, request: Request, params: Record<string, any>) => string | Promise<string>, 
    moduleURL: URL,
    customTags?: (request?: Request, params?: Record<string, any>) => Record<string, CustomTag>,
    cacheLifetime?: number
}

export type StaticRoute = { 
    route: string,
    middleware?: Middleware
    fileURL: URL, 
    contentType: string | undefined
}

export type RequestEvent = {
    date: string,
    status: number,
    method: string,
    url: string,
    responseTime: string,
    headers: Record<string, string>
}