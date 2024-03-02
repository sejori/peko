import router from "../examples/preact/router.ts";

Deno.serve((req) => router.handle(req));

console.log("Deno server running with Peko router <3");
