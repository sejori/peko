export type PekoConfig = { 
    devMode: boolean,
    port: number, 
    hostname: string, 
    defaultCacheLifetime: number, 
    hotReloadDelay: number,
    logHandler: (log: string) => void, 
    logDataHandler: (data: PekoLogData) => void,
    error404Response: Response, 
    error500Response: Response 
}

export type PekoRoute = { 
    url: string, 
    method: string, 
    handler: (a: Request) => Promise<Response>, 
}
export type PekoPageRouteData = { 
    url: string,
    template: (request: Request, html: string, script: string) => string, 
    componentURL: URL, 
    cacheLifetime: number
}
export type PekoStaticRouteData = { 
    url: string,
    fileURL: URL, 
    contentType: string 
}

export type PekoLogData = {
    date: string,
    status: number,
    method: string,
    url: string,
    responseTime: number,
    headers: Record<string, string>
}