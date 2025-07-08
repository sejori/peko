import { Token, Tokeniser } from "./Tokeniser.ts";

type QueryValueType = string | QueryObjectType | QueryValueType[];

interface QueryObjectType {
  [key: string]: QueryValueType | QueryValueType[];
}

export type GraphQLOperation = {
  type: "query" | "mutation" | "subscription";
  name: string;
  variables: QueryObjectType;
};

export type GraphQLField = {
  alias?: string;
  args?: QueryObjectType;
  directives?: string[];
  fields?: GraphQLObject;
} | null;

export type GraphQLObject = Record<string, GraphQLField>;

export class QueryParser {
  operation: GraphQLOperation;
  ast: GraphQLObject;
  private fragments: Record<string, GraphQLObject> = {};
  private tokens: Token[] = [];
  private pos = 0;

  constructor(query: string) {
    const tokeniser = new Tokeniser(query);
    this.tokens = tokeniser.tokens;
    this.fragments = this.parseFragments();
    this.operation = this.parseOperation();
    this.ast = this.parseSelectionSet();
  }

  private peek(type: string, offset = 0): boolean {
    return this.tokens[this.pos + offset]?.type === type;
  }

  private consume(type?: string): Token {
    const tok = this.tokens[this.pos++];
    if (type && tok?.type !== type) {
      throw new Error(`Expected ${type} but got ${tok?.type}`);
    }
    return tok;
  }

  private parseFragments(): Record<string, GraphQLObject> {
    const fragments: Record<string, GraphQLObject> = {};
    while (this.peek("NAME") && this.tokens[this.pos].value === "fragment") {
      this.consume("NAME"); // fragment
      const name = this.consume("NAME").value;
      this.consume("NAME"); // 'on'
      this.consume("NAME"); // type
      this.consume("{");
      const fields = this.parseSelectionSet();
      fragments[name] = fields;
    }
    return fragments;
  }

  private parseOperation(): GraphQLOperation {
    const type = this.consume("NAME").value as GraphQLOperation["type"];
    const name = this.peek("NAME") ? this.consume("NAME").value : "";
    const variables: QueryObjectType = {};

    if (this.peek("(")) {
      this.consume("(");
      while (!this.peek(")")) {
        const variable = this.consume("VARIABLE").value.slice(1);
        this.consume(":");
        const type = this.consume("NAME").value;
        if (this.peek("!")) this.consume("!");
        variables[variable] = type + (this.tokens[this.pos - 1].value === "!" ? "!" : "");
        if (this.peek(",")) this.consume(",");
      }
      this.consume(")");
    }

    this.consume("{");
    return { type, name, variables };
  }

  private parseSelectionSet(): GraphQLObject {
    const fields: GraphQLObject = {};

    while (!this.peek("}")) {
      if (this.peek("ELLIPSIS")) {
        this.consume("ELLIPSIS");
        if (this.peek("NAME") && this.tokens[this.pos].value === "on") {
          this.consume("NAME"); // 'on'
          this.consume("NAME"); // type
          this.consume("{");
          const inline = this.parseSelectionSet();
          Object.assign(fields, inline);
        } else {
          const fragName = this.consume("NAME").value;
          Object.assign(fields, structuredClone(this.fragments[fragName]));
        }
        continue;
      }

      let alias: string | undefined;
      let name = this.consume("NAME").value;
      if (this.peek(":")) {
        this.consume(":");
        alias = name;
        name = this.consume("NAME").value;
      }

      let args: QueryObjectType | undefined;
      if (this.peek("(")) {
        args = this.parseArgs();
      }

      const directives: string[] = [];
      while (this.peek("@")) {
        this.consume("@");
        const dirName = this.consume("NAME").value;
        let dir = `@${dirName}`;
        if (this.peek("(")) {
          const start = this.pos;
          let depth = 0;
          do {
            const t = this.consume();
            if (t.type === "(") depth++;
            if (t.type === ")") depth--;
          } while (depth > 0);
          const dirTokens = this.tokens.slice(start - 1, this.pos);
          dir = `@${dirTokens.map(t => t.value).join("")}`;
        }
        directives.push(dir);
      }

      let subFields: GraphQLObject | undefined;
      if (this.peek("{")) {
        this.consume("{");
        subFields = this.parseSelectionSet();
      }

      fields[alias || name] = {
        ...(alias ? { alias: name } : {}),
        ...(args ? { args } : {}),
        ...(directives.length ? { directives } : {}),
        ...(subFields ? { fields: subFields } : {}),
      };
    }

    this.consume("}");
    return fields;
  }

  private parseArgs(): QueryObjectType {
    const args: QueryObjectType = {};
    this.consume("(");
    while (!this.peek(")")) {
      const key = this.consume("NAME").value;
      this.consume(":");
      args[key] = this.parseValue();
      if (this.peek(",")) this.consume(",");
    }
    this.consume(")");
    return args;
  }

  private parseValue(): QueryValueType {
    const token = this.tokens[this.pos];
    if (token.type === "STRING" || token.type === "VARIABLE") return this.consume().value;
    if (token.type === "{") return this.parseObject();
    if (token.type === "[") return this.parseArray();
    return this.consume().value; // fallback for simple types
  }

  private parseObject(): QueryObjectType {
    const obj: QueryObjectType = {};
    this.consume("{");
    while (!this.peek("}")) {
      const key = this.consume("NAME").value;
      this.consume(":");
      obj[key] = this.parseValue();
      if (this.peek(",")) this.consume(",");
    }
    this.consume("}");
    return obj;
  }

  private parseArray(): QueryValueType[] {
    const arr: QueryValueType[] = [];
    this.consume("[");
    while (!this.peek("]")) {
      arr.push(this.parseValue());
      if (this.peek(",")) this.consume(",");
    }
    this.consume("]");
    return arr;
  }
}
