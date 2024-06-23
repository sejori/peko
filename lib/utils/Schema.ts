import { RequestContext } from "../Router";
import { Middleware } from "../types";
export class ID extends String {}
export class Int extends Number {}
export class Float extends Number {}
export const defaultScalars = { ID, Int, Float, Boolean, Date, String };

type FieldType = (typeof defaultScalars)[keyof typeof defaultScalars];
interface Field<T extends FieldType> {
  type: T;
  nullable?: boolean;
  resolver?: (ctx: RequestContext) => Promise<InstanceType<T>[]>;
  validator?: (value: InstanceType<T>) => boolean;
}
type FieldRecord = Record<string, FieldType | Field<FieldType>>;
type FieldMap<T extends FieldRecord> = {
  [K in keyof T]: T[K] extends Field<FieldType> ? Field<T[K]["type"]> : T[K];
};
type ResolvedFields<T extends FieldRecord> = {
  [K in keyof T]: T[K] extends Field<FieldType> ? T[K]["type"] : T[K];
};

export class DTO<T extends FieldRecord> {
  constructor(public name: string, public fields: FieldMap<T>) {}
}

export class Type<T extends FieldRecord> extends DTO<T> {
  constructor(
    name: string,
    fields: FieldMap<T>
    // public resolver: (
    //   ctx: RequestContext
    // ) => Promise<ResolvedFields<T>> | ResolvedFields<T>
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
    // public resolver: (
    //   ctx: RequestContext
    // ) => Promise<ResolvedFields<OFields>> | ResolvedFields<OFields>,
    public middleware: Middleware[]
  ) {
    super(
      name,
      output.fields
      // resolver
    );
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
  public scalars = {
    ...defaultScalars,
  };

  constructor(
    public queries: Query<
      FieldRecord,
      FieldRecord,
      DTO<FieldRecord>,
      Type<FieldRecord>
    >[],
    additionalScalars: Record<string, Function> = {}
  ) {
    Object.keys(additionalScalars).forEach(
      (key) => (this.scalars[key] = additionalScalars[key])
    );
  }

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
