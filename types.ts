export type PekoConfig = { 
    devMode: boolean,
    port: number, 
    hostname: string, 
    defaultCacheLifetime: number, 
    hotReloadDelay: number, 
    srcDirURL: URL,
    logHandler: (log: string) => void, 
    requestCaptureHandler: (request: Request) => void, 
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
    cacheLifetime: number | undefined
}
export type PekoStaticRouteData = { 
    url: string,
    fileURL: URL, 
    contentType: string 
}