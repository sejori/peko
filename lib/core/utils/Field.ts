import { DefaultState, RequestContext } from "../context.ts";
import { Model  } from "./Model.ts";
import { ValidationError } from "./ValidationError.ts";

// deno-lint-ignore no-explicit-any
export type Constructor<O = any> = new (...args: any[]) => O;

export interface FieldOptions<T extends Constructor | Constructor[], N extends boolean> {
  description?: string;
  nullable?: N;
  defaultValue?: InstanceType<T extends Constructor[] ? T[0] : T>;
  validator?: (
    value: InstanceType<T extends Constructor[] ? T[0] : T>
  ) => { valid: boolean; message?: string };
}

export interface FieldInterface<
  T extends Constructor | Constructor[], 
  N extends boolean
> {
  new (
    parent: InstanceType<Constructor>,
    name: string,
    input: N extends true 
      ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
      : InstanceType<T extends Constructor[] ? T[0] : T>
  ): {
    value: N extends true 
    ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
    : InstanceType<T extends Constructor[] ? T[0] : T>
    errors: ValidationError[];
  };
  type: T;
  opts: FieldOptions<T, N>;
}

export class Field<T extends Constructor | Constructor[], N extends boolean> {
  static type: Constructor | Constructor[];
  static opts: FieldOptions<Constructor | Constructor[], boolean>;
  type: Constructor | Constructor[];
  _opts: FieldOptions<T, N>;

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
    this.type = (this.constructor as FieldInterface<T, N>).type;
    this._opts = (this.constructor as FieldInterface<T, N>).opts;

    if (input) {
      if (this._opts.validator) {
        const { valid, message } = this._opts.validator(
          input as InstanceType<T extends Constructor[] ? T[0] : T>
        );
        if (!valid) {
          this.errors.push(
            new ValidationError(
              `${parent.constructor.name} ${name} field of type ${Array.isArray(this.type) 
                ? `${this.type[0].name} array` 
                : this.type.name} : ${message}`
            )
          );
        }
      }  
    } else if (!this._opts.nullable && !this._opts.defaultValue) {
      this.errors.push(
        new ValidationError(
          `${parent.constructor.name} ${name} field of type ${Array.isArray(this.type) 
            ? `${this.type[0].name} array` 
            : this.type.name} cannot be null`
        )
      );
    }

    const singularType = Array.isArray(this.type) ? this.type[0] : this.type as Constructor;
    const fallback = input || this._opts.defaultValue || null;
    this.value = (
      Array.isArray(fallback) 
        ? fallback.map((v: Constructor) => this._opts.nullable && v === null ? null : new singularType(v)) 
        :  this._opts.nullable && fallback === null ? null : new singularType(fallback)
    ) as N extends true 
        ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
        : InstanceType<T extends Constructor[] ? T[0] : T>;

    Object.freeze(this);
  }
}

export function FieldFactory<T extends Constructor | Constructor[]>(
  type: T
): FieldInterface<T, false>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T, N> & { nullable: true }
): FieldInterface<T, true>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T, N> & { nullable?: false }
): FieldInterface<T, false>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T, N>
): FieldInterface<T, boolean>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T, 
  opts: FieldOptions<T, N> = {}
): FieldInterface<T, N> {
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
    } as FieldInterface<T, N>;
}

export type ResolvedFieldValue<
  T extends Constructor | Constructor[],
  Nullable extends boolean = false
> = Nullable extends true
    ? T extends Constructor[]
        ? Array<InstanceType<T[0]> | null>
        : InstanceType<Extract<T, Constructor>> | null
    : T extends Constructor[]
      ? Array<InstanceType<T[0]>>
      : InstanceType<Extract<T, Constructor>>

export interface Resolver<
  S extends DefaultState = DefaultState,
  T extends Constructor | Constructor[] = Constructor | Constructor[],
  N extends boolean = false
> {
  (ctx: RequestContext<S>): T extends Constructor[] 
    ? N extends false
      ? InstanceType<T[0]>[] | Promise<InstanceType<T[0]>>[]
      : (InstanceType<T[0]> | null)[] | Promise<(InstanceType<T[0]> | null)[]>
    : T extends Constructor
      ? N extends false
        ? InstanceType<T> | Promise<InstanceType<T>>
        : null | InstanceType<T> | Promise<InstanceType<T> | null>
      : null;
}

export interface ResolvedFieldOptions<
  S extends DefaultState = DefaultState,
  T extends Constructor | Constructor[] = Constructor,
  N extends boolean = false
> extends FieldOptions<T, N> {
  resolver: Resolver<S, T, N>;
}

export interface ResolvedFieldInterface<
  S extends DefaultState,
  T extends Constructor | Constructor[], 
  Nullable extends boolean
> extends FieldInterface<T, Nullable> {
  resolver: Resolver<S, T, Nullable>;
}

export class ResolvedField<S extends DefaultState, T extends Constructor | Constructor[], N extends boolean> extends Field<T, N> {
  static override opts: ResolvedFieldOptions<DefaultState, Constructor | Constructor[], boolean>;
  static resolver: Resolver<DefaultState, Constructor | Constructor[], boolean>;
  declare _opts: ResolvedFieldOptions<S, T, N>;

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
  S extends DefaultState = DefaultState,
  T extends Constructor | Constructor[] = Constructor
>(
  type: T,
  opts: ResolvedFieldOptions<S, T, true> & { nullable: true }
): ResolvedFieldInterface<S, T, true>;
export function ResolvedFieldFactory<
  S extends DefaultState = DefaultState,
  T extends Constructor | Constructor[] = Constructor
>(
  type: T,
  opts: ResolvedFieldOptions<S, T, false> & { nullable?: false }
): ResolvedFieldInterface<S, T, false>;
export function ResolvedFieldFactory<
  S extends DefaultState = DefaultState,
  T extends Constructor | Constructor[] = Constructor,
  N extends boolean = false
>(
  type: T, 
  opts: ResolvedFieldOptions<S, T, N>
): ResolvedFieldInterface<S, T, N> {
  return class extends ResolvedField<S, T, N> {
    static override type = type;
    static override opts = opts as ResolvedFieldOptions<DefaultState, T, N>;
    static override resolver = opts.resolver as Resolver;

    constructor(
      parent: InstanceType<Constructor>,
      name: string,
      input: N extends true 
        ? InstanceType<T extends Constructor[] ? T[0] : T> | null 
        : InstanceType<T extends Constructor[] ? T[0] : T>
    ) {
      super(parent, name, input);
    }
  } as ResolvedFieldInterface<S, T, N>;
}
