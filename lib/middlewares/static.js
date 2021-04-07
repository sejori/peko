import { extname } from "https://deno.land/std@0.91.0/path/mod.ts"

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

export const staticHandler = async (request, path) => {
    const headers = new Headers()
    const contentHeading = MEDIA_TYPES[extname(path)]
    if (contentHeading) headers.append("Content-Type", contentHeading)

    const body = await Deno.readFile(path)

    return request.respond({
        headers,
        body
    })
}