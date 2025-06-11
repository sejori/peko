import { Constructor, Field, FieldInterface } from "./Field.ts";
import { ValidationError } from "./ValidationError.ts";

export type Fields = {
  [key: string]: ReturnType<typeof Field>;
};

type InferFromFields<TFields extends Fields> = {
  [K in keyof TFields]: TFields[K] extends FieldInterface<infer C, infer N>
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

export function Model<TFields extends Fields>(schema: TFields) {
  return class ModelClass {
    static schema = schema;
    _errors: {
      [key: string]: ValidationError[];
    } = {};
    
    constructor(input: InferFromFields<TFields>) {
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
    new (input: InferFromFields<TFields>): {
      _errors: {
        [key: string]: ValidationError[];
      };
    } & InferFromFields<TFields>;
    schema: TFields;
  };
}

export type ModelType = ReturnType<typeof Model>[];