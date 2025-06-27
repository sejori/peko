export interface DefaultState {
  [key: string]: unknown;
}

export class RequestContext<S extends DefaultState = DefaultState> {
  url: URL;
  params: Record<string, string> = {};

  constructor(
    public request: Request, 
    public state: S = {} as S
  ) {
    this.url = new URL(request.url);
  }
}