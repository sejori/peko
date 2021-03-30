import { walk } from "https://deno.land/std@0.91.0/fs/mod.ts"
import { acceptable, acceptWebSocket } from "https://deno.land/std/ws/mod.ts";

import { srcHandler } from "../middlewares/src.js"

// for await (const req of server) {
//   if (
//     req.method === "GET" &&
//     req.url === "/ws" &&
//     acceptable(req)
//   ) {
//     acceptWebSocket({
//       headers: req.headers,
//       conn: req.conn,
//       bufWriter: req.w,
//       bufReader: req.r,
//     }).then(async (sock) => {
//       for await (const msg of sock) {
//         if (typeof msg === "string") {
//           // handle messages...
//         }
//       }
//     }).catch((e) => {
//       req.respond({ status: 400 });
//     });
//   } else {
//     req.respond({ status: 404 });
//   }
// }

export const getSrcRoutes = async (ENVIRONMENT) => {
    const staticRoutes = []
    const srcDir = `${Deno.cwd()}/src`

    // I need to add file watching to each src file and trigger a page refresh 
    // in browser when any src file changes
    if (ENVIRONMENT !== "production") {
        const worker = new Worker(new URL("../utils/watcher.js", import.meta.url).href, { 
            type: "module", 
            deno: { namespace: true }
        })
        worker.postMessage({ srcDir })
    }

    for await (const file of walk(srcDir)) {
        if (file.isFile) {
            staticRoutes.push({
                method: 'GET',
                url: `${file.path.slice(file.path.indexOf('src') + 3)}`,
                middleware: async (request) => {
                    const { headers, body } = await srcHandler(file.path)
                    request.respond({
                        headers,
                        body,
                    }) 
                }
            })
        }
    }

    return staticRoutes
}