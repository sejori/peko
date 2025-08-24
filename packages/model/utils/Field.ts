import type { RequestContext } from "../../core/types.ts";
import type { Model } from "./Model.ts";
import { ValidationError } from "./ValidationError.ts";

// deno-lint-ignore no-explicit-any
export type Constructor<O = any> = new (...args: any[]) => O;

export interface FieldOptions<T extends Constructor | Constructor[]> {
  description?: string;
  nullable?: boolean;
  defaultValue?: InstanceType<T extends Constructor[] ? T[0] : T>;
  validator?: (
    value: InstanceType<T extends Constructor[] ? T[0] : T>
  ) => { valid: boolean; message?: string };
}

export interface FieldInterface<
  T extends Constructor | Constructor[], 
  Nullable extends boolean
> {
  new (
    parent: InstanceType<Constructor>,
    name: string,
    input: Nullable extends true 
      ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
      : InstanceType<T extends Constructor[] ? T[0] : T>
  ): {
    value: Nullable extends true 
    ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
    : InstanceType<T extends Constructor[] ? T[0] : T>
    errors: ValidationError[];
  };
  type: T;
  nullable: boolean;
  defaultValue: InstanceType<T extends Constructor[] ? T[0] : T> | undefined;
  validator?: (
    value: InstanceType<T extends Constructor[] ? T[0] : T>
  ) => { 
    valid: boolean; 
    message?: string 
  };
}

export function Field<T extends Constructor | Constructor[]>(
  type: T
): FieldInterface<T, false>;
export function Field<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T> & { nullable: true }
): FieldInterface<T, true>;
export function Field<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T> & { nullable?: false }
): FieldInterface<T, false>;
export function Field<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T>
): FieldInterface<T, boolean>;
export function Field<T extends Constructor | Constructor[], N extends boolean>(
  type: T, 
  opts: FieldOptions<T> = {}
): FieldInterface<T, N> {
  return class FieldClass {
    static type = type;
    static description = opts.description;
    static nullable = opts.nullable || false;
    static defaultValue = opts.defaultValue;
    static validator = opts.validator;
    value: N extends true 
      ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
      : InstanceType<T extends Constructor[] ? T[0] : T>;
    errors: ValidationError[] = [];

    constructor(
      parent: InstanceType<Constructor>,
      name: string,
      input: N extends true 
        ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
        : InstanceType<T extends Constructor[] ? T[0] : T>,
    ) {
      if (input) {
        if (opts.validator) {
          const { valid, message } = opts.validator(
            input as InstanceType<T extends Constructor[] ? T[0] : T>
          );
          if (!valid) {
            this.errors.push(
              new ValidationError(
                `${parent.constructor.name} ${name} field of type ${Array.isArray(type) 
                  ? `${type[0].name} array` 
                  : type.name} : ${message}`
              )
            );
          }
        }  
      } else if (!opts.nullable && !opts.defaultValue) {
        this.errors.push(
          new ValidationError(
            `${parent.constructor.name} ${name} field of type ${Array.isArray(type) 
              ? `${type[0].name} array` 
              : type.name} cannot be null`
          )
        );
      }

      const singularType = Array.isArray(type) ? type[0] : type as Constructor;
      const fallback = input || opts.defaultValue || null;
      this.value = (
        Array.isArray(fallback) 
          ? fallback.map((v: Constructor) => opts.nullable && v === null ? null : new singularType(v)) 
          :  opts.nullable && fallback === null ? null : new singularType(fallback)
      ) as N extends true 
          ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
          : InstanceType<T extends Constructor[] ? T[0] : T>;

      Object.freeze(this);
    }
  }
}

export type Resolver<
  T extends Constructor | Constructor[],
  Nullable extends boolean = false
> = (
  ctx: RequestContext
) => Promise<
  Nullable extends true
    ? T extends Constructor[]
        ? Array<InstanceType<T[0]> | null>
        : InstanceType<Extract<T, Constructor>> | null
    : T extends Constructor[]
      ? Array<InstanceType<T[0]>>
      : InstanceType<Extract<T, Constructor>>
>;

export interface ResolvedFieldOptions<
  T extends Constructor | Constructor[],
  Nullable extends boolean = false
> extends FieldOptions<T> {
  resolve: Resolver<T, Nullable>;
}

export interface ResolvedFieldInterface<
  T extends Constructor | Constructor[], 
  Nullable extends boolean
> extends FieldInterface<T, Nullable> {
  resolve: Resolver<T, Nullable>;
}

export function ResolvedField<
  T extends Constructor | Constructor[]
>(
  type: T,
  opts: ResolvedFieldOptions<T, true> & { nullable: true }
): ResolvedFieldInterface<T, true>;
export function ResolvedField<
  T extends Constructor | Constructor[]
>(
  type: T,
  opts: ResolvedFieldOptions<T, false> & { nullable?: false }
): ResolvedFieldInterface<T, false>;
export function ResolvedField<
  T extends Constructor | Constructor[],
  N extends boolean = false
>(
  type: T, 
  opts: ResolvedFieldOptions<T, N>
): ResolvedFieldInterface<T, N> {
  return class ResolvedFieldClass extends Field<T, N>(type, opts) {
    static resolve = opts.resolve;

    constructor(
      parent: Model,
      name: string,
      input: N extends true 
        ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
        : InstanceType<T extends Constructor[] ? T[0] : T>
    ) {
      super(parent, name, input);
    }
  } as ResolvedFieldInterface<T, N>;
}
