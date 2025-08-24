import type { Constructor, Field, FieldInterface } from "./Field.ts";
import type { ValidationError } from "./ValidationError.ts";

export type ModelSchema = {
  [key: string]: ReturnType<typeof Field>;
};

export type ModelSchemaType<TSchema extends ModelSchema> = {
  [K in keyof TSchema]: TSchema[K] extends FieldInterface<infer C, infer N>
    ? C extends Constructor<infer U>[] 
      ? N extends true 
        ? U[] | null
        : U[]
      : C extends Constructor<infer U> 
        ? N extends true 
          ? U | null
          : U
      : never
    : never
};

export class Model<TSchema extends ModelSchema = ModelSchema> {
  static schema: ModelSchema;

  _errors: {
    [key: string]: ValidationError[];
  } = {};
  
  constructor(input: ModelSchemaType<TSchema>) {
    // Get the static schema from the subclass
    const schema = (this.constructor as ModelInterface<TSchema>).schema;
    for (const key in schema) {
      const fieldType = schema[key];
      const inputValue = input[key];
      const field = new fieldType(this, key, inputValue);
      this._errors[key] = field.errors;

      Object.defineProperty(this, key, {
        value: field.value,
        enumerable: true,
        writable: false,
      });
    }
  }
}

// deno-lint-ignore no-explicit-any
export interface ModelInterface<TFields extends ModelSchema = any> {
    new (input: ModelSchemaType<TFields>): ModelSchemaType<TFields> & Model<TFields>;
    schema: TFields;
  }

export function ModelFactory<TFields extends ModelSchema>(schema: TFields) {
  return class extends Model<TFields> {
    static override schema = schema;

    constructor(input: ModelSchemaType<TFields>) {
      super(input);
    }
  } as ModelInterface<TFields>;
}