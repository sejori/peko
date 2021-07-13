import { extname } from "https://deno.land/std/path/mod.ts"

const MEDIA_TYPES = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".mjs": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png"
}

export const staticHandler = async (request, pathUrl) => {
    const headers = new Headers()
    const contentHeading = MEDIA_TYPES[extname(pathUrl.pathname)]
    if (contentHeading) headers.append("Content-Type", contentHeading)

    const body = await Deno.readFile(pathUrl)

    return request.respond({
        headers,
        body
    })
}