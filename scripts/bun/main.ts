import router from "../../example/preactSSR/router.ts";

declare global {
  interface Process {
    env: { [key: string]: string | undefined };
  }
  const process: Process;
  namespace Bun {
    function serve(options: {
      port: number;
      fetch(req: Request): Promise<Response>;
    }): {
      stop(): void;
    };
  }
}

router.middleware.unshift((ctx) => {
  ctx.state.env = process.env;
});

Bun.serve({
  port: 7778,
  fetch(req) {
    return router.handle(req);
  },
});

console.log("Bun server running with Peko router <3");
