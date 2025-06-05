import { Constructor, Field, FieldInterface } from "./Field.ts";
import { ValidationError } from "./ValidationError.ts";

export type Schema = {
  [key: string]: ReturnType<typeof Field>;
};

type InferFromSchema<TSchema extends Schema> = {
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

export function Model<TSchema extends Schema>(schema: TSchema) {
  return class ModelClass {
    static schema = schema;
    _errors: {
      [key: string]: ValidationError[];
    } = {};
    
    constructor(input: InferFromSchema<TSchema>) {
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
  } as {
    new (input: InferFromSchema<TSchema>): {
      _errors: {
        [key: string]: ValidationError[];
      };
    } & InferFromSchema<TSchema>;
    schema: TSchema;
  };
}