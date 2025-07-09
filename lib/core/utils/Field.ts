import { RequestContext } from "../context.ts";
import { Model } from "./Model.ts";
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
  Nullable extends boolean,
  O extends FieldOptions<T>
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
  opts: O;
}

export class Field<T extends Constructor | Constructor[], N extends boolean> {
  static type: Constructor | Constructor[];
  static opts: FieldOptions<Constructor | Constructor[]>;

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
    const type = (
      this.constructor as FieldInterface<Constructor | Constructor[], boolean, FieldOptions<T>>
    ).type;
    const opts = (
      this.constructor as FieldInterface<Constructor | Constructor[], boolean, FieldOptions<T>>
    ).opts;

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

export function FieldFactory<T extends Constructor | Constructor[]>(
  type: T
): FieldInterface<T, false, FieldOptions<T>>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T> & { nullable: true }
): FieldInterface<T, true, FieldOptions<T>>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T> & { nullable?: false }
): FieldInterface<T, false, FieldOptions<T>>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T>
): FieldInterface<T, boolean, FieldOptions<T>>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T, 
  opts: FieldOptions<T> = {}
): FieldInterface<T, N, FieldOptions<T>> {
  return class extends Field<T, N> {
      static override type = type;
      static override opts = opts;
  
      constructor(
        parent: InstanceType<Constructor>,
        name: string,
        input: N extends true 
          ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
          : InstanceType<T extends Constructor[] ? T[0] : T>
      ) {
        super(parent, name, input);
      }
    } as FieldInterface<T, N, FieldOptions<T>>;
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
> extends FieldInterface<T, Nullable, ResolvedFieldOptions<T, Nullable>> {
  resolve: Resolver<T, Nullable>;
}

export class ResolvedField<T extends Constructor | Constructor[], N extends boolean> extends Field<T, N> {
  static override opts: ResolvedFieldOptions<Constructor | Constructor[], boolean>;

  constructor(
    parent: Model,
    name: string,
    input: N extends true 
      ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
      : InstanceType<T extends Constructor[] ? T[0] : T>
  ) {
    super(parent, name, input);
  }
};

export function ResolvedFieldFactory<
  T extends Constructor | Constructor[]
>(
  type: T,
  opts: ResolvedFieldOptions<T, true> & { nullable: true }
): ResolvedFieldInterface<T, true>;
export function ResolvedFieldFactory<
  T extends Constructor | Constructor[]
>(
  type: T,
  opts: ResolvedFieldOptions<T, false> & { nullable?: false }
): ResolvedFieldInterface<T, false>;
export function ResolvedFieldFactory<
  T extends Constructor | Constructor[],
  N extends boolean = false
>(
  type: T, 
  opts: ResolvedFieldOptions<T, N>
): ResolvedFieldInterface<T, N> {
  return class extends ResolvedField<T, N> {
    static override type = type;
    static override opts = opts;

    constructor(
      parent: InstanceType<Constructor>,
      name: string,
      input: N extends true 
        ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
        : InstanceType<T extends Constructor[] ? T[0] : T>
    ) {
      super(parent, name, input);
    }
  } as ResolvedFieldInterface<T, N>;
}
