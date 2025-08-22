import Profile from "../../lib/core/utils/Profile.ts";
import myHTTPRouter from "../../examples/graphql/app.ts";
import { Router } from "../../mod.ts";

const abortController = new AbortController();
Deno.serve(
  {
    port: 7777,
    signal: abortController.signal,
  },
  (req) => myHTTPRouter.handle(req)
);

const handleLoginResults = await Profile.run(myHTTPRouter as Router, {
  mode: "handle",
  count: 100,
  excludedRoutes: [myHTTPRouter.schema, myHTTPRouter.authPage],
  requestInit: {
    method: "POST",
    body: `
      mutation Login($username: String!, $password: String!) {
        login(username: "test-user", password: "test-password") {
          username
          password
          jwt
        }
      }
    `
  }
});

const serveLoginResults = await Profile.run(myHTTPRouter as Router, {
  mode: "serve",
  url: "http://localhost:7777",
  count: 100,
  excludedRoutes: [myHTTPRouter.schema, myHTTPRouter.authPage],
  requestInit: {
    method: "POST",
    body: `
      mutation Login($username: String!, $password: String!) {
        login(username: "test-user", password: "test-password") {
          username
          password
          jwt
        }
      }
    `
  }
});

console.log("handle results");
console.log(`graphql login: ${handleLoginResults["/graphql"].avgTime}ms`);

console.log("serve results");
console.log(`graphql login: ${serveLoginResults["/graphql"].avgTime}ms`);

abortController.abort();
