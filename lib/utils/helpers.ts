import { stat, readdir } from "node:fs/promises"
import { Route } from "../types.ts"

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
 * @param routeGen: (path: string, url: URL) => Route
 * @param _depth: used internally to correct paths, don't set
 * @returns routes: Route[]
 */
export const routesFromDir = async (dirUrl: URL, routeGen: (path: `/${string}`, url: URL) => Route, _depth = 2): Promise<Route[]> => {
  if (!(await stat(dirUrl)).isDirectory()) throw new Error("URL does not point to directory.");
  const routes: Route[] = []

  for (const file of await readdir(dirUrl)) {
    const isDir = !file.includes(".")
    const fileUrl = new URL(`${dirUrl.href}${isDir ? "" : "/"}${file}`);
    
    if (isDir) {
      const subDirRoutes = await routesFromDir(fileUrl, routeGen, _depth+1)
      routes.splice(0, 0, ...subDirRoutes)
    } else {
      const pieces = fileUrl.pathname.split("/").filter(Boolean)
      let filePath = ''
      for (let i=1; i<=_depth; i++) filePath = `/${pieces[pieces.length-i]}${filePath}`
      routes.push(routeGen(filePath as `/${string}`, fileUrl))
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