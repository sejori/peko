import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { Tokeniser } from "../../utils/Tokeniser.ts";

Deno.test("Tokeniser - skips whitespace and comments", () => {
  const input = `  \t\n# comment\nNAME`;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;
  assertEquals(tokens, [{ type: "NAME", value: "NAME" }]);
});

Deno.test("Tokeniser - captures strings", () => {
  const input = `"hello" "world"`;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;
  assertEquals(tokens, [
    { type: "STRING", value: `"hello"` },
    { type: "STRING", value: `"world"` },
  ]);
});

Deno.test("Tokeniser - captures ellipsis", () => {
  const input = `...`;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;
  assertEquals(tokens, [{ type: "ELLIPSIS", value: "..." }]);
});

Deno.test("Tokeniser - captures variables", () => {
  const input = `$id $_var $123invalid`;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;
  assertEquals(tokens, [
    { type: "VARIABLE", value: "$id" },
    { type: "VARIABLE", value: "$_var" },
    // Note: $123invalid is invalid per GraphQL but tokenized as VARIABLE
    { type: "VARIABLE", value: "$123invalid" },
  ]);
});

Deno.test("Tokeniser - captures punctuation", () => {
  const input = `:{}()[]@,`;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;
  assertEquals(tokens, [
    { type: ":", value: ":" },
    { type: "{", value: "{" },
    { type: "}", value: "}" },
    { type: "(", value: "(" },
    { type: ")", value: ")" },
    { type: "[", value: "[" },
    { type: "]", value: "]" },
    { type: "@", value: "@" },
    { type: ",", value: "," },
  ]);
});

Deno.test("Tokeniser - captures names and keywords", () => {
  const input = `query User on_entity ID123`;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;
  assertEquals(tokens, [
    { type: "NAME", value: "query" },
    { type: "NAME", value: "User" },
    { type: "NAME", value: "on_entity" },
    { type: "NAME", value: "ID123" },
  ]);
});

Deno.test("Tokeniser - complex GraphQL sample", () => {
  const input = `
    query getUser($id: ID = "default") @directive {
      user(id: $id) {
        name
        ...userFields
      }
    }
  `;
  const tokeniser = new Tokeniser(input);
  const tokens = tokeniser.tokens;

  assertEquals(tokens, [
    { type: "NAME", value: "query" },
    { type: "NAME", value: "getUser" },
    { type: "(", value: "(" },
    { type: "VARIABLE", value: "$id" },
    { type: ":", value: ":" },
    { type: "NAME", value: "ID" },
    { type: "=", value: "=" },  // Note: '=' is matched by [!=] in regex
    { type: "STRING", value: `"default"` },
    { type: ")", value: ")" },
    { type: "@", value: "@" },
    { type: "NAME", value: "directive" },
    { type: "{", value: "{" },
    { type: "NAME", value: "user" },
    { type: "(", value: "(" },
    { type: "NAME", value: "id" },
    { type: ":", value: ":" },
    { type: "VARIABLE", value: "$id" },
    { type: ")", value: ")" },
    { type: "{", value: "{" },
    { type: "NAME", value: "name" },
    { type: "ELLIPSIS", value: "..." },
    { type: "NAME", value: "userFields" },
    { type: "}", value: "}" },
    { type: "}", value: "}" },
  ]);
});