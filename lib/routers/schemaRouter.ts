import { Middleware, RequestContext } from "../types.ts";
import { defaultScalars, DTO, Fields, ResolvedType } from "../utils/Schema.ts";
import { Router, Route, RouteConfig } from "./_router.ts";

export type Resolver<O extends DTO<Fields> | DTO<Fields>[]> = (
  ctx: RequestContext
) => Promise<ResolvedType<O>> | ResolvedType<O>;

export interface SchemaRouteConfig<O extends DTO<Fields> | DTO<Fields>[]>
  extends RouteConfig {
  method?: "QUERY" | "MUTATION" | "RESOLVER";
  args: Fields;
  data: O;
  middleware?: Middleware[];
  resolver: Resolver<O>;
}

export class SchemaRoute<O extends DTO<Fields> | DTO<Fields>[]> extends Route {
  declare method: SchemaRouteConfig<O>["method"];
  args: Fields;
  data: O;
  resolver: Resolver<O>;

  constructor(routeObj: SchemaRouteConfig<O>) {
    super(routeObj);
    this.method =
      (routeObj.method as SchemaRouteConfig<O>["method"]) || "QUERY";
    this.args = routeObj.args;
    this.data = routeObj.data as O;
    this.resolver = routeObj.resolver;
  }
}

export class SchemaRouter<
  Config extends SchemaRouteConfig<DTO<Fields>> = SchemaRouteConfig<
    DTO<Fields>
  >,
  R extends SchemaRoute<DTO<Fields>> = SchemaRoute<DTO<Fields>>
> extends Router<Config, R> {
  Route = SchemaRoute;

  constructor(
    public routes: R[] = [],
    public middleware: Middleware[] = [],
    public scalars: Record<string, new (...args: unknown[]) => unknown> = {
      ...defaultScalars,
    }
  ) {
    super();
  }

  // TODO: reimplement handle method to return JSON data and errors from ctx
  // (accumulated by routes)

  query<O extends DTO<Fields> | DTO<Fields>[]>(
    path: SchemaRouteConfig<O>["path"],
    data: Omit<SchemaRouteConfig<O>, "path">
  ) {
    const input = {
      path: path,
      method: "QUERY",
      ...data,
    };
    // @ts-ignore supply overload args∏
    const newRoute = this.addRoute(input);
    return newRoute;
  }

  mutation<O extends DTO<Fields> | DTO<Fields>[]>(
    path: SchemaRouteConfig<O>["path"],
    data: Omit<SchemaRouteConfig<O>, "path">
  ) {
    const input = {
      path: path,
      method: "MUTATION",
      ...data,
    };
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(input);
    return newRoute;
  }

  resolver<O extends DTO<Fields> | DTO<Fields>[]>(
    path: SchemaRouteConfig<O>["path"],
    data: Omit<SchemaRouteConfig<O>, "path">
  ) {
    const input = {
      path: path,
      method: "RESOLVER",
      ...data,
    };
    // @ts-ignore supply overload args
    const newRoute = this.addRoute(input);
    return newRoute;
  }
}
