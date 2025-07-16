import { Handler } from "../../core/types.ts";
import { QueryState } from "../middleware/query.ts";

export const queryResult: Handler<QueryState> = (ctx) => {
  const { data, errors } = ctx.state.queryResult || {};
  
  if (Object.keys(data).length === 0 && errors.length === 0) {
    return new Response(JSON.stringify({
      errors: [{ message: "No matching operations found" }]
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  return new Response(JSON.stringify({ data, errors }), {
    headers: { "Content-Type": "application/json" }
  });
};