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
  opts: FieldOptions<T>;
}

export class Field<T extends Constructor | Constructor[], N extends boolean> {
  static type: Constructor | Constructor[];
  static opts: FieldOptions<Constructor | Constructor[]>;
  type: Constructor | Constructor[];
  opts: FieldOptions<Constructor | Constructor[]>;

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
    this.type = (
      this.constructor as FieldInterface<Constructor | Constructor[], boolean>
    ).type;
    this.opts = (
      this.constructor as FieldInterface<Constructor | Constructor[], boolean>
    ).opts;

    if (input) {
      if (this.opts.validator) {
        const { valid, message } = this.opts.validator(
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
    } else if (!this.opts.nullable && !this.opts.defaultValue) {
      this.errors.push(
        new ValidationError(
          `${parent.constructor.name} ${name} field of type ${Array.isArray(this.type) 
            ? `${this.type[0].name} array` 
            : this.type.name} cannot be null`
        )
      );
    }

    const singularType = Array.isArray(this.type) ? this.type[0] : this.type as Constructor;
    const fallback = input || this.opts.defaultValue || null;
    this.value = (
      Array.isArray(fallback) 
        ? fallback.map((v: Constructor) => this.opts.nullable && v === null ? null : new singularType(v)) 
        :  this.opts.nullable && fallback === null ? null : new singularType(fallback)
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
  opts: FieldOptions<T> & { nullable: true }
): FieldInterface<T, true>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T> & { nullable?: false }
): FieldInterface<T, false>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T,
  opts: FieldOptions<T>
): FieldInterface<T, boolean>;
export function FieldFactory<T extends Constructor | Constructor[], N extends boolean>(
  type: T, 
  opts: FieldOptions<T> = {}
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

export type Resolver<
  T extends Constructor | Constructor[],
  N extends boolean = false
> = (
  ctx: RequestContext
) => Promise<ResolvedFieldValue<T, N>> | ResolvedFieldValue<T, N>;

export interface ResolvedFieldOptions<
  T extends Constructor | Constructor[],
  Nullable extends boolean = false
> extends FieldOptions<T> {
  resolver: Resolver<T, Nullable>;
}

export interface ResolvedFieldInterface<
  T extends Constructor | Constructor[], 
  Nullable extends boolean
> extends FieldInterface<T, Nullable> {
  resolver: Resolver<T, Nullable>;
}

export class ResolvedField<T extends Constructor | Constructor[], N extends boolean> extends Field<T, N> {
  static override opts: ResolvedFieldOptions<Constructor | Constructor[], boolean>;
  static resolver: Resolver<Constructor | Constructor[], boolean>;

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
    static override resolver = opts.resolver;

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
