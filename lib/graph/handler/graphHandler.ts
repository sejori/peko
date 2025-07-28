import { Handler } from "../../core/types.ts";
import { Model } from "../../core/utils/Model.ts";
import { QueryResultData, QueryState } from "../middleware/parseQuery.ts";

export const graphHandler: Handler<QueryState> = async (ctx) => {
  const { data, errors } = ctx.state.queryResult;
  console.log(ctx.state.queryResult);
  
  if (Object.keys(data).length === 0 && errors.length === 0) {
    return new Response(JSON.stringify({
      errors: [{ message: "No matching operations found" }]
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    // recursively resolve promises and move model errors up to root errors object
    const proccessData = async (data: QueryResultData) => {
      await Promise.all(Object.entries(data).map(async ([_key, value]) => {
        if (value instanceof Promise) value = await value;
        if (value instanceof Model || value[0] instanceof Model) {
          const models = Array.isArray(value) ? value : [value];
          for (const m of models) {
            Object.entries(m._errors).forEach(([_key, errs]) => {
              errors.concat(errs);
            });
            delete (m as Partial<Model>)._errors;
    
            Object.values(m).forEach(v => proccessData(v));
          }
        }
      }));
    }
    await proccessData(data);
  }
  
  return new Response(JSON.stringify({ data, errors }), {
    headers: { "Content-Type": "application/json" }
  });
};