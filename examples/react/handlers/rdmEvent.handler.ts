import { Handler } from "@peko/core/mod.ts";
import { sse } from "@peko/http/mod.ts";

const demoEventTarget = new EventTarget();
export const randomEventHandler: Handler = (ctx) => {
  setInterval(() => {
    demoEventTarget.dispatchEvent(
      new CustomEvent("send", { detail: Math.random() })
    );
  }, 2500);

  return sse(demoEventTarget)(ctx);
};
