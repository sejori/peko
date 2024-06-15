import { RequestContext } from "../Router";
import { Middleware } from "../types";

type FieldType =
  (typeof Schema.defaultScalers)[keyof typeof Schema.defaultScalers];

type Field<T extends FieldType> = {
  type: typeof Schema.defaultScalers;
  nullable?: boolean;
  resolver?: (ctx: RequestContext) => Promise<InstanceType<T>[]>;
  validator?: (value: InstanceType<T>) => boolean;
};

type Fields = {
  [key: string]: FieldType | Field<FieldType>;
};

type ResolvedFields<T extends Fields> = {
  [K in keyof T as T[K] extends { resolver: any } ? never : K]: T[K] extends {
    type: infer U;
  }
    ? U extends new (...args: any[]) => any
      ? InstanceType<U>
      : U
    : T[K];
};

export class DTO<T extends Fields> {
  constructor(public name: string, public fields: T) {}
}

export class Type<T extends Fields> extends DTO<T> {
  constructor(
    name: string,
    fields: T,
    public resolver: (
      ctx: RequestContext
    ) => Promise<ResolvedFields<T>> | ResolvedFields<T>
  ) {
    super(name, fields);
  }
}

export class Query<
  IFields extends Fields,
  OFields extends Fields,
  I extends DTO<IFields>,
  O extends Type<OFields>
> extends Type<OFields> {
  public type = "query";

  constructor(
    name: string,
    public input: I,
    public output: O,
    public resolver: (
      ctx: RequestContext
    ) => Promise<ResolvedFields<OFields>> | ResolvedFields<OFields>,
    public middleware: Middleware[]
  ) {
    super(name, output.fields, resolver);
  }
}

export class Mutation<
  IFields extends Fields,
  OFields extends Fields,
  I extends DTO<IFields>,
  O extends Type<OFields>
> extends Query<IFields, OFields, I, O> {
  public type = "mutation";
}

export class Schema {
  constructor(
    public queries: Query<Fields, Fields, DTO<Fields>, Type<Fields>>[]
  ) {}

  static defaultScalers = {
    ID: class ID extends String {},
    Int: class Int extends Number {},
    Float: class Float extends Number {},
    Boolean,
    Date,
    Number,
    String,
  };

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
