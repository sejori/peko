import { RequestContext } from "../Router";
import { Middleware } from "../types";

// default scalar types
export class ID extends String {}
export class Int extends Number {}
export class Float extends Number {}
type Scalar =
  | BooleanConstructor
  | DateConstructor
  | typeof Float
  | typeof ID
  | typeof Int
  | NumberConstructor
  | StringConstructor;
type DTOFields = {
  [K: string]: Scalar | DTO<DTOFields> | Field<Scalar | DTO<DTOFields>>;
};

export class DTO<T extends DTOFields> {
  public name: string;
  public fields: T;
  constructor(input: (typeof DTO)["prototype"]) {
    Object.assign(this, input);
  }
}

export class Type<T extends DTOFields> extends DTO<T> {
  public resolver: (ctx: RequestContext) => Promise<DTOResolvedType<T>[]>;
  constructor(input: {
    name: string;
    fields: T;
    resolver: (ctx: RequestContext) => Promise<DTOResolvedType<T>[]>;
  }) {
    super(input);
    Object.assign(this, input);
  }
}

export class Query<I extends DTO<DTOFields>, O extends Type<DTOFields>> {
  public type = "query";
  public name: string;
  public input: I;
  public output: O;
  public middleware: Middleware[];
  public resolver: (ctx: RequestContext) => Promise<O[]> | O[];
  constructor(input: (typeof Query)["prototype"]) {
    Object.assign(this, input);
  }
}

export class Mutation<
  I extends DTO<DTOFields>,
  O extends Type<DTOFields>
> extends Query<I, O> {
  public type = "mutation";
}

export class Schema {
  constructor(public queries: Query<DTO<DTOFields>, Type<DTOFields>>[]) {}

  toString() {
    return `
      type Query {
        ${this.queries
          .filter((query) => query.type == "query")
          .map((name) => `${name}: ${name}`)
          .join("\n")}
      }

      type Mutation {
        ${this.queries
          .filter((query) => query.type == "mutation")
          .map((name) => `${name}: ${name}`)
          .join("\n")}
      }

      ${this.queries
        .map((query) => {
          return `
            input ${query.input.name} {
              ${Object.keys(query.input.fields)
                .map((field) => `${field}: ${field}`)
                .join("\n")}
            }
          `;
        })
        .join("\n")}

      ${this.queries
        .map((query) => {
          return `
            type ${query.output.name} {
              ${Object.keys(query.output.fields)
                .map((field) => `${field}: ${field}`)
                .join("\n")}
            }
          `;
        })
        .join("\n")}
    `;
  }
}

type Field<T> = {
  type: T;
  nullable?: boolean;
  resolver?: (ctx: RequestContext) => Promise<InstanceType<T>[]>;
  validator?: (value: InstanceType<T>) => boolean;
};
type DTOResolvedType<T extends DTOFields> = {
  [K in keyof T["fields"]]: T["fields"][K] extends {
    resolver: (ctx: RequestContext) => Promise<DTOResolvedType<T>[]>;
  }
    ? never
    : T["fields"][K] extends Field<Scalar>
    ? InstanceType<T["fields"][K]["type"]>
    : T["fields"][K] extends new (...args: any[]) => any
    ? InstanceType<T["fields"][K]>
    : T["fields"][K];
};
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;
