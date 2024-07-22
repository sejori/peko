import { Handler } from "../../../mod.ts";

export const parrotHandler: Handler = async (ctx) => {
  const reader = ctx.request.body?.getReader();
  let result = "";
  const chunkSize = 1024;

  if (reader) {
    let done = false;
    while (!done) {
      const { value, done: chunkDone } = await reader.read();
      if (value) {
        result += new TextDecoder().decode(value);
        if (result.length >= chunkSize) {
          result = result.slice(0, chunkSize);
          break;
        }
      }
      done = chunkDone;
    }
  }

  return new Response(`Parrot sqwarks: ${result}`);
};
