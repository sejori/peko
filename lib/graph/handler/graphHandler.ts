import { Handler } from "../../core/types.ts";
import { Model } from "../../core/utils/Model.ts";
import { QueryFieldData, QueryState } from "../middleware/parseQuery.ts";
import { ValidationError } from "../../core/utils/ValidationError.ts";
import { AST } from "../utils/QueryParser.ts";
import { RequestContext } from "../../core/context.ts";

type ProcessingLayer = Array<{ data: Awaited<QueryFieldData>, ast: AST | undefined }>;

async function processWithBatching(
  ctx: RequestContext<QueryState>,
  rootData: QueryFieldData,
  rootAst: AST | undefined,
  errors: ValidationError[]
): Promise<void> {
  if (rootData instanceof Promise) rootData = await rootData;
  if (!rootData || typeof rootData !== "object") return;

  let currentLevel: ProcessingLayer = [
    { data: rootData, ast: rootAst }
  ];

  while (currentLevel.length > 0) {
    const resolvers: Promise<void>[] = [];
    const nextLevel: ProcessingLayer = [];

    for (const { data, ast } of currentLevel) {
      if (!data) continue;
      if (Array.isArray(data)) {
        // Handle arrays by adding all items to next level
        data.forEach(item => {
          if (item && typeof item === "object") {
            nextLevel.push({ data: item, ast });
          }
        });
        continue;
      }

      // Process fields at current level
      if (data instanceof Model) {
        for (const key in data) {
          // ignore error fields
          if (key !== "_errors") {
            const fieldAst = ast?.[key];
            if (!fieldAst) {
              delete data[key];
              continue;
            }
  
            const field = data[key];
            if (typeof field === "function") {
              // Batch all ResolvedField resolvers at this level
              resolvers.push(
                Promise.resolve(field.resolve(ctx))
                  .then(resolved => {
                    data[key] = resolved;
                    // Queue resolved children for next level
                    if (resolved && typeof resolved === "object") {
                      nextLevel.push({ 
                        data: resolved, 
                        ast: fieldAst.fields 
                      });
                    }
                  })
                  .catch(err => {
                    errors.push(err);
                    data[key] = null;
                  })
              );
            } else if (field instanceof Model) {
              // Queue Model children for next level
              nextLevel.push({ 
                data: field, 
                ast: fieldAst.fields 
              });
            }
          } else {
            Object.values(data._errors).forEach(errs => errors.push(...errs));
            delete (data as Partial<Model>)._errors;
          }
        } 
      }
    }

    // Wait for all resolvers at current level to complete
    await Promise.all(resolvers);
    currentLevel = nextLevel;
  }
}

export const graphHandler: Handler<QueryState> = async (ctx) => {
  const { data, errors } = ctx.state.queryResult;
  const parsedQuery = ctx.state.query;

  if (Object.keys(data).length === 0 && errors.length === 0) {
    return new Response(JSON.stringify({
      errors: [{ message: "No matching operations found" }]
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  await Promise.all(Object.entries(data).map(async ([opName, opResult]) => {
    await processWithBatching(ctx, opResult, parsedQuery.ast[opName]?.fields, errors);
  }));

  return new Response(JSON.stringify({ data, errors }), {
    headers: { "Content-Type": "application/json" }
  });
};