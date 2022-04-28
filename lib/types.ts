export type Config = { 
    devMode?: boolean,
    port?: number, 
    hostname?: string, 
    defaultCacheLifetime?: number, 
    hotReloadDelay?: number,
    logHandler?: (log: string) => Promise<void>, 
    analyticsHandler?: (data: AnalyticsData) => Promise<void | null>,
    errorHandler?: (request: Request, statusCode: number) => Promise<Response>
}

export type Route = { 
    route: string, 
    method: string, 
    handler: (a: Request) => Promise<Response>
}

export type CustomTag = `<${string}>`
export type SSRRouteData = { 
    route: string,
    template: (htmlContent: string, customTags?: Record<string, CustomTag>, request?: Request) => string,
    render: (app: any, request?: Request, ) => string, 
    moduleURL: URL,
    customTags?: Record<string, CustomTag>,
    cacheLifetime?: number
}

export type StaticRouteData = { 
    route: string,
    fileURL: URL, 
    contentType: string | undefined
}

export type AnalyticsData = {
    date: string,
    status: number,
    method: string,
    url: string,
    responseTime: string,
    headers: Record<string, string>
}