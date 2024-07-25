import { Handler, sse } from "../../../mod.ts";

const demoEventTarget = new EventTarget();
export const randomEventHandler: Handler = (ctx) => {
  setInterval(() => {
    demoEventTarget.dispatchEvent(
      new CustomEvent("send", { detail: Math.random() })
    );
  }, 2500);

  return sse(demoEventTarget)(ctx);
};
