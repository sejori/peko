import { Router } from "../../mod.ts"
import { 
  testMiddleware1,
  testMiddleware2,
  testMiddleware3,
  testHandler
} from "../mocks/middleware.ts";

const router = new Router()

router.get("/", [
  testMiddleware1,
  testMiddleware2,
  testMiddleware3
], testHandler);

Bun.serve({
  fetch(req) {
    return router.handle(req)
  }
})

