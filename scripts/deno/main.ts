import router from "../../example/reactSSR/router.ts";

declare global {
  namespace Deno {
    function serve(
      options: {
        port: number;
        signal?: AbortSignal;
      },
      handler: (req: Request) => Promise<Response>
    ): {
      stop(): void;
    };

    const env: {
      toObject(): Record<string, string>;
    };
  }
}

router.middleware.unshift((ctx) => {
  ctx.state.env = Deno.env.toObject();
});

// Start Deno server with Peko router :^)
Deno.serve(
  {
    port: 7777,
  },
  (req) => router.handle(req)
);

console.log("Deno server running with Peko router <3");
