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

export const bufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// TODO: sitemap generator
// export const generateSitemap = (server: Server) => {
//   return server.allRoutes.map(route => {
//     // some custom sitemap object in here
//   })
// }
