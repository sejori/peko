import { Middleware } from "../types";

type FieldConstructors =
  | StringConstructor
  | NumberConstructor
  | DateConstructor
  | BooleanConstructor
  | Type<Record<string, FieldConstructors>>;
type DTO = Record<string, FieldConstructors>;
type Fields<T extends DTO> = Record<
  string,
  | FieldConstructors
  | {
      type: FieldConstructors;
      resolver?: (nodes: Type<T>[]) => any;
      validator?: (value: any) => boolean;
    }
>;
type InstanceTypeFromConstructor<T> = T extends new (...args: any[]) => infer R
  ? R
  : never;

type FieldConstructorsToTypes<T extends DTO> = {
  [K in keyof T]: InstanceTypeFromConstructor<T[K]>;
};

export class Input<T extends DTO> {
  constructor(public name: string, public fields: Fields<T>) {}
}
export class Type<T extends DTO> {
  constructor(
    public name: string,
    public fields: Fields<T>,
    public resolver: (
      id: string[]
    ) => Promise<FieldConstructorsToTypes<T>>[] | FieldConstructorsToTypes<T>[]
  ) {}
}

export class Query<I extends Input<DTO>, O extends Type<DTO> | Type<DTO>[]> {
  type = "query";
  constructor(
    public name: string,
    public input: I,
    public output: O,
    public middleware: Middleware[],
    public resolver: (args: I) => O
  ) {
    Object.assign(this, input);
  }
}
export class Mutation<
  I extends Input<DTO>,
  O extends Type<DTO> | Type<DTO>[]
> extends Query<I, O> {
  type = "mutation";
}

export class Schema {
  constructor(public queries: Query<Input<DTO>, Type<DTO>>[]) {}

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
