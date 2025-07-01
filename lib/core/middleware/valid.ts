import { Middleware } from '../types.ts';
import { ModelInterface, ModelSchemaType } from "../utils/Model.ts";

export type ValidJSON<M extends ModelInterface> = {
  json: ModelSchemaType<M["schema"]>;
};

/**
 * Middleware to parse JSON request body and assign it to ctx.state.body.
 * If the request's Content-Type is not application/json, it does nothing.
 * If the JSON is invalid, it returns a 400 Bad Request response.
 *
 * @param model - The model type to validate against (optional).
 * @returns Middleware function
 */
export function validJSON<M extends ModelInterface>(
  model?: M
): Middleware<{ json: ModelSchemaType<M["schema"]> }> {
  return async (ctx) => {
    if (
      ctx.request.headers.get('Content-Type') === "application/json"
    ) {
      try {
        const json = await ctx.request.json();
        if (model) {
          const modelInstance = new model(json);
          const errors = Object.entries(modelInstance._errors).filter(([_property, errors]) => errors.length > 0);
          if (errors.length > 0) {
            return new Response(`Validation failed. ${errors.map(([_property, errors]) => 
              `\nValidation errors: ${JSON.stringify(errors.map(e => e.message))}`
            )}`, {
              status: 400,
              headers: { 'Content-Type': 'text/plain' },
            });
          }
          ctx.state.json = modelInstance as ModelSchemaType<M["schema"]>;
        } else {
          ctx.state.json = json as ModelSchemaType<M["schema"]>;
        }
      } catch {
        return new Response("Invalid JSON", {
          status: 400,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    } else {
      return new Response("Invalid Content-Type header, must be application/json.", {
          status: 400,
          headers: { 'Content-Type': 'text/plain' },
        });
    }
  };
}