class GraphAST {
  constructor(
    public type: "query" | "mutation" | "type" | "field",
    public name: string,
    public mutation: string,
    public args: Record<string, any>,
    public children: GraphAST[],
    public parent: GraphAST
  ) {}
}

export function parseAST(body: unknown): GraphAST {
  return {
    type: "query",
    name: "query",
    mutation: "query",
    args: {},
    children: [],
    parent: null,
  };
}
