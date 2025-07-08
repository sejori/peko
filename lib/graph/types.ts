export const graphOperations = ["QUERY", "MUTATION", "RESOLVER", "SUBSCRIPTION"] as const;
export type GraphOperation = typeof graphOperations[number];