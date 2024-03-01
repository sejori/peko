/**
 * Merge source headers into base headers and return base
 * @param base: Headers
 * @param source: Headers
 * @returns
 */
export const mergeHeaders = (base: Headers, source: Headers) => {
  for (const pair of source) {
    base.set(pair[0], pair[1]);
  }

  return base;
};

// TODO: sitemap generator
// export const generateSitemap = (server: Server) => {
//   return server.allRoutes.map(route => {
//     // some custom sitemap object in here
//   })
// }
