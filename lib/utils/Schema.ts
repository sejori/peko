import { RequestContext } from "../Router";
import { Middleware } from "../types";

// additional default scalars
export class ID extends String {}
export class Int extends Number {}
export class Float extends Number {}

type FieldType =
  (typeof Schema.defaultScalers)[keyof typeof Schema.defaultScalers];

export interface Field<T extends FieldType> {
  type: T;
  nullable?: boolean;
  resolver?: (ctx: RequestContext) => Promise<InstanceType<T>[]>;
  validator?: (value: InstanceType<T>) => boolean;
}
export type FieldRecord = Record<string, FieldType | Field<FieldType>>;
export type FieldMap<T extends FieldRecord> = {
  [K in keyof T]: T[K] extends Field<FieldType> ? Field<T[K]["type"]> : T[K];
};

type ResolvedFields<T extends FieldMap<FieldRecord>> = {
  [K in keyof T as T[K] extends { resolver: any } ? never : K]: T[K] extends {
    type: infer U;
  }
    ? U extends new (...args: any[]) => any
      ? InstanceType<U>
      : U
    : T[K];
};

export class DTO<T extends FieldRecord> {
  constructor(public name: string, public fields: FieldMap<T>) {}
}

export class Type<T extends FieldRecord> extends DTO<T> {
  constructor(
    name: string,
    fields: FieldMap<T>,
    public resolver: (
      ctx: RequestContext
    ) => Promise<ResolvedFields<T>> | ResolvedFields<T>
  ) {
    super(name, fields);
  }
}

export class Query<
  IFields extends FieldRecord,
  OFields extends FieldRecord,
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
  IFields extends FieldRecord,
  OFields extends FieldRecord,
  I extends DTO<IFields>,
  O extends Type<OFields>
> extends Query<IFields, OFields, I, O> {
  public type = "mutation";
}

export class Schema {
  constructor(
    public queries: Query<
      FieldRecord,
      FieldRecord,
      DTO<FieldRecord>,
      Type<FieldRecord>
    >[]
  ) {}

  static defaultScalers = { ID, Int, Float, Boolean, Date, Number, String };

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
