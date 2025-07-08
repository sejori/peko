import { Token, Tokeniser } from "./Tokeniser.ts";

type QueryValueType = string | QueryObjectValueType | QueryValueType[];

export interface QueryObjectValueType {
  [key: string]: QueryValueType | QueryValueType[];
}

export type QueryOperation = {
  type: "query" | "mutation" | "subscription";
  name: string;
  variables: QueryObjectValueType;
};

export type QueryField = {
  alias?: string;
  args?: QueryObjectValueType;
  directives?: string[];
  fields?: QueryObject;
} | null;

export type QueryObject = Record<string, QueryField>;

export class QueryParser {
  operation: QueryOperation;
  ast: QueryObject;
  private fragments: Record<string, QueryObject> = {};
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

  private parseFragments(): Record<string, QueryObject> {
    const fragments: Record<string, QueryObject> = {};
    let currentPos = 0;

    while (currentPos < this.tokens.length) {
      if (
        this.tokens[currentPos]?.type === "NAME" && 
        this.tokens[currentPos]?.value === "fragment"
      ) {
        this.pos = currentPos;

        this.consume("NAME"); // fragment
        const name = this.consume("NAME").value;
        this.consume("NAME"); // 'on'
        this.consume("NAME"); // type
        this.consume("{");
        const fields = this.parseSelectionSet();
        fragments[name] = fields;

        currentPos = this.pos;
      }
      currentPos++;
    }
    
    this.pos = 0;

    return fragments;
  }

  private parseOperation(): QueryOperation {
    let type: QueryOperation["type"] = "query";
    let name = "";
    const variables: QueryObjectValueType = {};

    // Handle anonymous query (starting with selection set)
    if (this.peek("{")) {
      this.consume("{");
      return { type, name, variables };
    }

    const firstToken = this.consume("NAME");
    if (["query", "mutation", "subscription"].includes(firstToken.value)) {
      type = firstToken.value as QueryOperation["type"];
    } else {
      throw new Error(`Invalid operation type: ${firstToken.value}`);
    }
    if (this.peek("NAME")) {
      name = this.consume("NAME").value;
    }

    // Parse variables if present
    if (this.peek("(")) {
      this.consume("(");
      while (!this.peek(")")) {
        const variable = this.consume("VARIABLE").value.slice(1);
        this.consume(":");
        const varType = this.consume("NAME").value;
        if (this.peek("!")) this.consume("!");
        variables[variable] = varType + (this.tokens[this.pos - 1].value === "!" ? "!" : "");
        if (this.peek(",")) this.consume(",");
      }
      this.consume(")");
    }

    this.consume("{");
    return { type, name, variables };
  }

  private parseSelectionSet(): QueryObject {
    const fields: QueryObject = {};

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

      let args: QueryObjectValueType | undefined;
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

      let subFields: QueryObject | undefined;
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

  private parseArgs(): QueryObjectValueType {
    const args: QueryObjectValueType = {};
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

  private parseObject(): QueryObjectValueType {
    const obj: QueryObjectValueType = {};
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
