export type Config = { 
    devMode: boolean,
    port: number, 
    hostname: string, 
    defaultCacheLifetime: number, 
    hotReloadDelay: number,
    logHandler: (log: string) => Promise<void>, 
    analyticsHandler: (data: AnalyticsData) => Promise<void>,
    errorHandler: (statusCode: number, request: Request) => Promise<Response>
}

export type Route = { 
    route: string, 
    method: string, 
    handler: (a: Request) => Promise<Response>, 
}

export type HTMLRouteData = { 
    route: string,
    template: (request: Request, customTags: Record<string, `<${string}>`>, html: string) => string,
    render: (app: any) => string, 
    moduleURL: URL,
    customTags: Record<string, `<${string}>`>,
    cacheLifetime: number
}

export type StaticRouteData = { 
    route: string,
    fileURL: URL, 
    contentType: string 
}

export type AnalyticsData = {
    date: string,
    status: number,
    method: string,
    url: string,
    responseTime: string,
    headers: Record<string, string>
}