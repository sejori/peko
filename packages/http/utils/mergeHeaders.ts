/**
 * Merge source headers into base headers and return base
 * @param base: Headers
 * @param source: Headers
 * @returns
 */
export const mergeHeaders = (base: Headers, ...sources: Headers[]) => {
  sources.forEach((source) =>
    source.forEach((value, key) => {
      base.set(key, value);
    })
  );

  return base;
};

// TODO: sitemap generator
// export const generateSitemap = (server: Server) => {
//   return server.allRoutes.map(route => {
//     // some custom sitemap object in here
//   })
// }
