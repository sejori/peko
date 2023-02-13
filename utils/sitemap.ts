import { 
  Server
} from "../Server.ts"

export const generateSitemap = (server: Server) => {
  return server.routes.map(route => {
    // some custom sitemap object in here
  })
}