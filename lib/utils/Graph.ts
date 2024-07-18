// class GraphAST {
//   constructor(
//     public type: "query" | "mutation" | "type" | "field",
//     public name: string,
//     public mutation: string,
//     public args: Record<string, any>,
//     public children: GraphAST[],
//     public parent: GraphAST
//   ) {}
// }

// export function parseAST(body: unknown): GraphAST {
//   return {
//     type: "query",
//     name: "query",
//     mutation: "query",
//     args: {},
//     children: [],
//     parent: null,
//   };
// }

// recursive parser??^

type GraphQLField = {
  name: string;
  alias?: string;
  arguments: Record<string, any>;
  directives: Record<string, any>;
  selections: GraphQLField[];
};

type GraphQLOperation = {
  type: "query" | "mutation" | "subscription";
  name: string | null;
  variableDefinitions: Record<string, any>;
  directives: Record<string, any>;
  selections: GraphQLField[];
};

type GraphQLFragment = {
  name: string;
  typeCondition: string;
  selections: GraphQLField[];
};

type GraphQLDocument = {
  operations: GraphQLOperation[];
  fragments: Record<string, GraphQLFragment>;
};

class GraphQL {
  public parseRequest(
    requestBody: string | Record<string, any>
  ): GraphQLDocument {
    let query: string;
    let variables: Record<string, any> = {};

    if (typeof requestBody === "string") {
      requestBody = JSON.parse(requestBody);
    }

    if (typeof requestBody === "object") {
      if (!requestBody.query) {
        throw new Error("Invalid GraphQL request: Missing query field");
      }
      query = requestBody.query.trim();
      if (requestBody.variables) {
        variables = requestBody.variables;
      }
    } else {
      throw new Error("Invalid GraphQL request: Must be a string or an object");
    }

    if (
      !query.startsWith("{") &&
      !query.startsWith("query") &&
      !query.startsWith("mutation") &&
      !query.startsWith("subscription") &&
      !query.startsWith("fragment")
    ) {
      throw new Error(
        "Invalid GraphQL query: Must start with {, an operation keyword, or fragment"
      );
    }

    const operations: GraphQLOperation[] = [];
    const fragments: Record<string, GraphQLFragment> = {};
    let currentIndex = 0;

    while (currentIndex < query.length) {
      if (
        query[currentIndex] === "{" ||
        query.startsWith("query", currentIndex) ||
        query.startsWith("mutation", currentIndex) ||
        query.startsWith("subscription", currentIndex)
      ) {
        const [operation, newIndex] = this.parseOperation(
          query,
          currentIndex,
          variables
        );
        operations.push(operation);
        currentIndex = newIndex;
      } else if (query.startsWith("fragment", currentIndex)) {
        const [fragment, newIndex] = this.parseFragment(query, currentIndex);
        fragments[fragment.name] = fragment;
        currentIndex = newIndex;
      } else {
        currentIndex++;
      }
    }

    return { operations, fragments };
  }

  private parseOperation(
    body: string,
    index: number,
    variables: Record<string, any>
  ): [GraphQLOperation, number] {
    const operationRegex =
      /^(query|mutation|subscription)?\s*([a-zA-Z_][a-zA-Z0-9_]*)?\s*(\((.*?)\))?\s*(\@[^\{]*)?\{(.*)$/s;
    const match = body.slice(index).match(operationRegex);
    if (!match) {
      throw new Error("Invalid GraphQL query: Unable to parse operation");
    }

    const operationType = match[1] || "query"; // Default to 'query' if no operation is specified
    const name = match[2] || null;
    const variableDefinitions = match[3]
      ? this.parseVariableDefinitions(match[4], variables)
      : {};
    const directives = match[5] ? this.parseDirectives(match[5]) : {};
    const selectionsBody = match[6].trim();
    const selections = this.parseSelections(selectionsBody);

    return [
      {
        type: operationType,
        name,
        variableDefinitions,
        directives,
        selections,
      },
      index + match[0].length,
    ];
  }

  private parseVariableDefinitions(
    definitions: string,
    variables: Record<string, any>
  ): Record<string, any> {
    const vars: Record<string, any> = {};
    const varRegex =
      /\$([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([a-zA-Z_][a-zA-Z0-9_!\[\]]*)/g;
    let match;

    while ((match = varRegex.exec(definitions)) !== null) {
      const [, varName, varType] = match;
      vars[varName] = { type: varType, value: variables[varName] };
    }

    return vars;
  }

  private parseDirectives(directives: string): Record<string, any> {
    const dirs: Record<string, any> = {};
    const dirRegex = /\@([a-zA-Z_][a-zA-Z0-9_]*)\s*(\((.*?)\))?/g;
    let match;

    while ((match = dirRegex.exec(directives)) !== null) {
      const [, dirName, , dirArgs] = match;
      dirs[dirName] = dirArgs ? this.parseArguments(dirArgs) : {};
    }

    return dirs;
  }

  private parseSelections(body: string): GraphQLField[] {
    const selections: GraphQLField[] = [];
    let currentIndex = 0;

    while (currentIndex < body.length && body[currentIndex] !== "}") {
      const [field, newIndex] = this.parseField(body, currentIndex);
      selections.push(field);
      currentIndex = newIndex;

      while (body[currentIndex] === " " || body[currentIndex] === ",") {
        currentIndex++; // Skip whitespace and commas
      }
    }

    return selections;
  }

  private parseField(body: string, index: number): [GraphQLField, number] {
    const fieldRegex =
      /^([a-zA-Z_][a-zA-Z0-9_]*)(\s*\:\s*([a-zA-Z_][a-zA-Z0-9_]*))?\s*(\((.*?)\))?\s*(\@[^\{]*)?\{?/s;
    const match = body.slice(index).match(fieldRegex);
    if (!match) {
      throw new Error("Invalid GraphQL query: Unable to parse field");
    }

    const name = match[3] || match[1];
    const alias = match[3] ? match[1] : undefined;
    const args = match[5] ? this.parseArguments(match[5]) : {};
    const directives = match[6] ? this.parseDirectives(match[6]) : {};
    const subSelections: GraphQLField[] = [];

    let currentIndex = index + match[0].length;
    if (body[currentIndex] === "{") {
      const [parsedSelections, newIndex] = this.parseSelectionSet(
        body,
        currentIndex
      );
      subSelections.push(...parsedSelections);
      currentIndex = newIndex;
    }

    return [
      { name, alias, arguments: args, directives, selections: subSelections },
      currentIndex,
    ];
  }

  private parseFragment(
    body: string,
    index: number
  ): [GraphQLFragment, number] {
    const fragmentRegex =
      /^fragment\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+on\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{(.*)$/s;
    const match = body.slice(index).match(fragmentRegex);
    if (!match) {
      throw new Error("Invalid GraphQL query: Unable to parse fragment");
    }

    const name = match[1];
    const typeCondition = match[2];
    const selectionsBody = match[3].trim();
    const selections = this.parseSelections(selectionsBody);

    return [{ name, typeCondition, selections }, index + match[0].length];
  }

  private parseSelectionSet(
    body: string,
    index: number
  ): [GraphQLField[], number] {
    const selections: GraphQLField[] = [];
    index++; // Skip the opening brace

    while (body[index] !== "}") {
      const [field, newIndex] = this.parseField(body, index);
      selections.push(field);
      index = newIndex;

      while (body[index] === " " || body[index] === ",") {
        index++; // Skip whitespace and commas
      }
    }

    return [selections, index + 1]; // Skip the closing brace
  }

  private parseArguments(args: string): Record<string, any> {
    const argumentsObj: Record<string, any> = {};
    const argRegex =
      /([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*("[^"]*"|\d+|true|false|null)/g;
    let match;

    while ((match = argRegex.exec(args)) !== null) {
      const [, argName, argValue] = match;
      argumentsObj[argName] = this.parseArgumentValue(argValue);
    }

    return argumentsObj;
  }

  private parseArgumentValue(value: string): any {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (!isNaN(Number(value))) return Number(value);
    return value.replace(/^"|"$/g, ""); // Remove quotes for string values
  }
}

// Example usage:
const rawRequestBody = `
{
  "query": "query getUser($userId: ID!) { user(id: $userId) { id name } }",
  "variables": {
    "userId": 99
  }
}`;

const graphql = new GraphQL();

try {
  const requestBody = JSON.parse(rawRequestBody);
  const ast = graphql.parseRequest(requestBody);
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error(error.message);
}
