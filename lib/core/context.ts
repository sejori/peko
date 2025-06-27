export interface DefaultState {
  auth: Record<string, unknown> | null;
  hitCache: boolean;
}

export class RequestContext<S extends DefaultState = DefaultState> {
  url: URL;
  params: Record<string, string> = {};

  constructor(
    public request: Request, 
    public state: S = {
      auth: null,
      hitCache: false
    } as S
  ) {
    this.url = new URL(request.url);
  }
}