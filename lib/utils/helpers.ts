import { Middleware, Route } from "../types.ts"
import { staticHandler } from "../handlers/static.ts"

/**
 * Merge source headers into base headers and return base
 * @param base: Headers
 * @param source: Headers
 * @returns 
 */
export const mergeHeaders = (base: Headers, source: Headers) => {
  for (const pair of source) {
    base.set(pair[0], pair[1])
  }

  return base
}

/**
 * Recursively create an array of routes with the static handler 
 * for all files/sub-directories in the provided directory.
 * @param dirUrl: URL
 * @param middleware: Middleware for each route added
 * @param routes: init Route array
 * @param depth: used internally to correct paths, don't set
 * @returns routes: Route[]
 */
export const staticDir = async (dirUrl: URL, middleware?: Middleware | Middleware[], routes?: Route[], _depth = 1): Promise<Route[]> => {
  if (!(await Deno.stat(dirUrl)).isDirectory) throw new Error("URL does not point to directory.")
  if (!routes) routes = []

  for await (const file of Deno.readDir(dirUrl)) {
    const fileUrl = new URL(`file://${dirUrl.pathname}/${file.name}`)
    if (file.isDirectory) {
      await staticDir(fileUrl, middleware, routes, _depth+1)
    } else {
      const pieces = dirUrl.pathname.split("/")

      let dirPath = ''
      for (let i=1; i<_depth; i++) dirPath = `${pieces[pieces.length-i]}/${dirPath}`

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

// TODO: sitemap generator
// export const generateSitemap = (server: Server) => {
//   return server.allRoutes.map(route => {
//     // some custom sitemap object in here
//   })
// }