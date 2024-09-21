import { BaseRouter } from "./routers/_Router.ts";

export class RequestContext<T extends object = Record<string, unknown>> {
    url: URL;
    state: T;
    params: Record<string, string> = {};
  
    constructor(public router: BaseRouter, public request: Request, state?: T) {
      this.url = new URL(request.url);
      this.state = state ? state : ({} as T);
    }
  }