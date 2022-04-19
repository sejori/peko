export type PekoConfig = { 
    devMode: boolean,
    port: number, 
    hostname: string, 
    defaultCacheLifetime: number, 
    hotReloadDelay: number,
    logHandler: (log: string) => void, 
    analyticsHandler: (data: PekoAnalyticsData) => void,
    errorHandler: (statusCode: number, request: Request) => Promise<Response>
}

export type PekoRoute = { 
    route: string, 
    method: string, 
    handler: (a: Request) => Promise<Response>, 
}

export type PekoPageRouteData = { 
    route: string,
    moduleURL: URL,
    serverRender: (app: Function) => string,
    clientHydrate: { module: string, script: string },
    template: (request: Request, params: Record<string, unknown>, html: string, hydrationModule: string, hydrationSript: string) => string, 
    customParams: Record<string, unknown>,
    cacheLifetime: number
}

export type PekoStaticRouteData = { 
    route: string,
    fileURL: URL, 
    contentType: string 
}

export type PekoAnalyticsData = {
    date: string,
    status: number,
    method: string,
    url: string,
    responseTime: number,
    headers: Record<string, string>
}