import { RequestContext } from "../context.ts";

export class CacheItem {
  key: string;
  value: Response;
  dob: number;
  count: number;

  constructor(key: string, value: Response) {
    this.key = key;
    this.value = value;
    this.dob = Date.now();
    this.count = 0;
  }
}

export const defaultKeyGen = (ctx: RequestContext) => {
  const reqURL = new URL(ctx.request.url);
  return `${ctx.request.method}-${reqURL.pathname}${
    reqURL.search
  }-${JSON.stringify(ctx.state)}`;
};
