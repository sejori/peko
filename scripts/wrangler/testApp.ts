import { getTestRouter } from "../../tests/mocks/middleware.ts";

const testRouter = getTestRouter();

export default {
  fetch(request: Request) {
    return testRouter.handle(request);
  },
} satisfies ExportedHandler;
