import { Server } from "../server.ts"
import { Middleware, Route } from "../types.ts"
import { staticHandler } from "../handlers/static.ts"

export const mergeHeaders = (base: Headers, source: Headers) => {
  for (const pair of source) {
    base.set(pair[0], pair[1])
  }

  return base
}

export const staticDir = async (dirUrl: URL, middleware?: Middleware | Middleware[], routes?: Route[], depth = 1): Promise<Route[]> => {
  if (!(await Deno.stat(dirUrl)).isDirectory) throw new Error("URL does not point to directory.")
  if (!routes) routes = []

  for await (const file of Deno.readDir(dirUrl)) {
    const fileUrl = new URL(`file://${dirUrl.pathname}/${file.name}`)
    if (file.isDirectory) {
      await staticDir(fileUrl, middleware, routes, depth+1)
    } else {
      const pieces = dirUrl.pathname.split("/")

      let dirPath = ''
      for (let i=1; i<depth; i++) dirPath = `${pieces[pieces.length-i]}/${dirPath}`

      const filePath = `${dirPath}${file.name}`
      routes.push({
        path: `/${filePath}`,
        middleware,
        handler: staticHandler(fileUrl)
      })
    }
  }

  return routes
}

export const generateSitemap = (server: Server) => {
  return server.allRoutes.map(route => {
    // some custom sitemap object in here
  })
}