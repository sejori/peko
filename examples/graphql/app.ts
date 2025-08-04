import { ValidationError } from "../../lib/core/utils/ValidationError.ts";
import { Schema } from "../../lib/graph/utils/Schema.ts";
import { GraphRouterFactory, ModelFactory, FieldFactory, auth, HttpRouterFactory, ssr, parseQuery } from "../../mod.ts";
import { JWTPayload, krypto, validateUser, html } from "../auth/app.ts";

class User extends ModelFactory({
  username: FieldFactory(String),
  password: FieldFactory(String),
}) {}

class LoginData extends ModelFactory({
  ...User.schema,
  jwt: FieldFactory(String)
}) {}

class MyGraphRouter extends GraphRouterFactory({
  middleware: [
    auth<JWTPayload>(krypto),
    parseQuery,
  ]
}) {
  login = this.mutation("login", {
    type: LoginData,
    args: User,
    resolver: async (_ctx, args) => {
      const { username, password } = args;

      if (!(await validateUser(username.valueOf(), password.valueOf()))) {
        throw new ValidationError("Bad credentials");
      }

      const exp = new Date();
      exp.setMonth(exp.getMonth() + 1);
      const jwtPayload: JWTPayload = {
      iat: Date.now(),
      exp: exp.valueOf(),
      data: { username: username.valueOf() },
      }
      const jwt = await krypto.sign(jwtPayload);
      
      return new LoginData({
        username,
        password: "redacted",
        jwt
      });
    }
  });

  verify = this.query("verify", {
    type: LoginData,
    resolver: (ctx) => {
      if (!ctx.state.auth) throw new ValidationError("No auth credentials.")
      return new LoginData({
        username: ctx.state.auth.data.username,
        password: "redacted",
        jwt: ctx.request.headers.get("Authorization")?.slice(7) || ""
      })
    }
  });
}

class MyHTTPRouter extends HttpRouterFactory({
  middleware: [
    // log(console.log)
  ]
}) {
  graphRouter = new MyGraphRouter();

  schema = this.GET("/graphql", () => new Response(new Schema(this.graphRouter.routes).toString()));

  query = this.POST("/graphql", (ctx) => this.graphRouter.handle(ctx.request));

  authPage = this.GET(
    "/",
    ssr(
      () => html`<!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Peko auth example</title>
            <style>
              html,
              body {
                height: 100%;
                width: 100%;
                margin: 0;
                background-color: steelblue;
              }
              .auth-box {
                width: 300px;
                margin: 10rem auto;
                padding: 1rem;
                border: 1px solid black;
              }
            </style>
          </head>
          <body>
            <div class="auth-box">
              <input id="email" type="email" value="test-user" />
              <input id="password" type="password" value="test-password" />
              <button id="login">Login</button>
              <button onclick="verify()">Test Auth</button>
              <p>Status: <span id="status"></span></p>
              <p>
                Response:
                <span id="response" style="word-wrap: break-word"></span>
              </p>
            </div>

            <script>
              const email = document.querySelector("#email");
              const password = document.querySelector("#password");
              const loginBtn = document.querySelector("#login");
              const status = document.querySelector("#status");
              const responseText = document.querySelector("#response");
              let jwt;

              async function login() {
                const response = await fetch("/graphql", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    query: String("mutation Login($username: String!, $password: String!) { " +
                      "login(username: $username, password: $password) { " +
                        "username " +
                        "password " +
                        "jwt " +
                      "} " +
                    "}"),
                    variables: {
                      username: email.value,
                      password: password.value,
                    }
                  }),
                });

                const json = await response.json();
                console.log(json);
                jwt = json.data.login.jwt;
                responseText.innerText = jwt;

                updateStatus(response.status);
                updateButton();
              }

              function logout() {
                jwt = "";
                responseText.innerText = jwt;

                updateStatus();
                updateButton();
              }

              async function verify() {
                 const response = await fetch("/graphql", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                  },
                  body: JSON.stringify({
                    query: String("query Verify { " +
                      "verify { " +
                        "username " +
                        "password " +
                        "jwt " +
                      "} " +
                    "}")
                  }),
                });

                updateStatus(response.status);
                responseText.innerText = await response.text();
              }

              function updateStatus(statusCode = "") {
                status.innerText = statusCode;
                if (statusCode !== 200 && statusCode !== 201) {
                  status.style.color = "red";
                } else {
                  status.style.color = "limegreen";
                }
              }

              function updateButton() {
                loginBtn.textContent = jwt ? "Logout" : "Login";
                loginBtn.onclick = jwt ? logout : login;
              }

              updateButton();
            </script>
          </body>
        </html>
      `
    )
  );
}

export default new MyHTTPRouter();
