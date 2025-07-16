export interface Token {
  type: string;
  value: string;
};

export class Tokeniser {
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  get tokens(): Token[] {
    const tokens: Token[] = [];
    // match all valid GraphQL symbols and characters to avoid whitespaces etc
    const re = /\s+|#[^\n]*|"[^"]*"|\d+\.\d+|\d+|[A-Za-z_][\w]*|\.\.\.|[:{}()\[\]@,]|\$[\w]+|[!=]/g;
    let match: RegExpExecArray | null;

    while ((match = re.exec(this.input)) !== null) {
      const val = match[0];
      if (/^\s+$/.test(val) || val.startsWith("#")) continue; // skip comments
      if (/^".*"$/.test(val)) tokens.push({ type: "STRING", value: val });
      else if (val === "...") tokens.push({ type: "ELLIPSIS", value: val });
      else if (/^\d+\.\d+$/.test(val)) tokens.push({ type: "FLOAT", value: val });
      else if (/^\d+$/.test(val)) tokens.push({ type: "INT", value: val });
      else if (/^\$/.test(val)) tokens.push({ type: "VARIABLE", value: val });
      else if (/[{}()\[\]:,@!=]/.test(val)) tokens.push({ type: val, value: val });
      else tokens.push({ type: "NAME", value: val });
    }

    return tokens;
  }
}