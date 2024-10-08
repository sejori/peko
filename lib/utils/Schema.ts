import { RequestContext } from "../context.ts";
import { Middleware } from "../types.ts";

export class ID extends String {}
export class Int extends Number {}
export class Float extends Number {}
export const defaultScalars = { ID, Int, Float, Boolean, Date, String };
export type Scalars = (typeof defaultScalars)[keyof typeof defaultScalars];

export class Enum<T extends Record<string, string>> {
  constructor(public name: string, public values: T) {}
}

type GroupedTypes = Scalars | Enum<Record<string, string>> | DTO<Fields>;
type FieldType = GroupedTypes | GroupedTypes[];
interface Fields {
  [key: string]: Field<FieldType>;
}

interface FieldConfig<T extends FieldType> {
  nullable?: boolean;
  validator?: (
    x: ResolvedType<T>
  ) => boolean | { pass: boolean; message: string };
  resolver?: (x: RequestContext) => Promise<ResolvedField<Field<T>>[]>;
}
export class Field<T extends FieldType> {
  constructor(public type: T, public config: FieldConfig<T> = {}) {}
}

interface DTOConfig<F extends Fields> {
  fields: F;
}
export class DTO<F extends Fields> {
  constructor(public name: string, public config: DTOConfig<F>) {}
}
export class Input<F extends Fields> extends DTO<F> {}
export class Type<F extends Fields> extends DTO<F> {}

export class Query<O extends Type<Fields> | Type<Fields>[]> {
  public type = "query";
  constructor(public name: string, public config: QueryConfig<O>) {}
}

export class Mutation<
  O extends Type<Fields> | Type<Fields>[]
> extends Query<O> {
  public type = "mutation";
}

interface QueryConfig<O extends Type<Fields> | Type<Fields>[]> {
  args: Fields;
  data: O;
  resolver: (ctx: RequestContext) => Promise<ResolvedField<Field<O>>>;
  middleware?: Middleware[];
}

type ResolvedFields<Fields> = {
  [P in keyof Fields]: ResolvedField<Fields[P]>;
};

type ResolvedField<T> = T extends Field<infer F>
  ? F extends GroupedTypes[]
    ? ResolvedType<F[0]>[]
    : ResolvedType<F>
  : never;

export type ResolvedType<T> = T extends Type<infer Fields>
  ? ResolvedFields<Fields>
  : T extends Scalars
  ? InstanceType<T>
  : T extends Enum<Record<string, string>>
  ? T["values"][keyof T["values"]]
  : never;

export class Schema {
  public scalars: Record<string, Function> = {
    ...defaultScalars,
  };

  constructor(
    public operations: Query<Type<Fields> | Type<Fields>[]>[],
    additionalScalars: Record<string, Function> = {}
  ) {
    Object.keys(additionalScalars).forEach(
      (key) => (this.scalars[key] = additionalScalars[key])
    );
  }

  toString() {
    let schema = "# GraphQL Schema (autogenerated)\n\n";
    schema += this.generateScalars();
    schema += "\n\n";
    schema += this.generateEnums();

    schema += "type Query {\n";
    schema += this.generateOperationFields("query");
    schema += "\n}\n\n";

    schema += "type Mutation {\n";
    schema += this.generateOperationFields("mutation");
    schema += "\n}\n\n";

    schema += this.generateDTOs();
    schema += "\n\n";

    return schema;
  }

  private generateScalars(): string {
    return Object.keys(this.scalars)
      .map((key) => `scalar ${key}`)
      .join("\n");
  }

  private generateEnums(): string {
    const enums = new Set<Enum<any>>();
    let enumsString = "";

    const collectFromFields = (fields: Fields) => {
      Object.values(fields).forEach((field) => {
        if (field instanceof Input || field instanceof Type) {
          collectFromFields(field.config.fields);
        } else {
          const fieldType = field.type;
          if (fieldType instanceof Enum) {
            enums.add(fieldType);
          } else if (Array.isArray(fieldType) && fieldType[0] instanceof Enum) {
            enums.add(fieldType[0]);
          }
        }
      });
    };

    this.operations.forEach((operation) => {
      collectFromFields(operation.config.args);
      if (Array.isArray(operation.config.data)) {
        collectFromFields(operation.config.data[0].config.fields);
      } else {
        collectFromFields(operation.config.data.config.fields);
      }
    });

    enums.forEach((enumType) => {
      enumsString += `enum ${enumType.name} {\n`;
      Object.values(enumType.values).forEach((value) => {
        enumsString += `  ${value}\n`;
      });
      enumsString += "}\n\n";
    });

    return enumsString;
  }

  private generateOperationFields(type: "query" | "mutation"): string {
    return this.operations
      .filter((operation) => operation.type === type)
      .map((operation) => {
        const args = Object.entries(operation.config.args)
          .map(([name, field]) => `${name}: ${this.generateFieldString(field)}`)
          .join(", ");
        const outputType = Array.isArray(operation.config.data)
          ? `[${operation.config.data[0].name}]!`
          : `${operation.config.data.name}!`;
        return `  ${operation.name}(${args}): ${outputType}`;
      })
      .join("\n");
  }

  private generateDTOs(): string {
    const DTOs = new Set<{
      dtoType: "input" | "type";
      dto: DTO<Fields> | DTO<Fields>[];
    }>();
    let dtoString = "";

    this.operations.forEach((operation) => {
      Object.values(operation.config.args).forEach((arg) => {
        if (arg.type instanceof Input) {
          DTOs.add({ dtoType: "input", dto: arg.type });
        }
      });
      DTOs.add({ dtoType: "type", dto: operation.config.data });
    });

    DTOs.forEach((dto) => {
      dtoString += this.generateDTOFields(dto);
    });

    return dtoString;
  }

  private generateDTOFields(input: {
    dtoType: "input" | "type";
    dto: DTO<Fields> | DTO<Fields>[];
  }): string {
    const dtoInput = input.dto;
    const isArray = Array.isArray(dtoInput);
    const dto = isArray ? dtoInput[0] : dtoInput;

    const fieldsString = Object.entries(dto.config.fields)
      .map(([fieldName, field]) => {
        const fieldTypeString = this.generateFieldString(field);
        return `  ${fieldName}: ${fieldTypeString}`;
      })
      .join("\n");

    return `${input.dtoType} ${dto.name} {\n${fieldsString}\n}\n\n`;
  }

  private generateFieldString(field: Field<FieldType>): string {
    const isArray = Array.isArray(field.type);
    const baseType = Array.isArray(field.type) ? field.type[0] : field.type;
    const typeName = baseType instanceof Type ? baseType.name : baseType.name;
    return `${isArray ? `[${typeName}]` : typeName}${
      field.config.nullable ? "" : "!"
    }`;
  }
}