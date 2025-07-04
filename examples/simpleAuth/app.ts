import * as Peko from "../../mod.ts"; // "https://deno.land/x/peko/mod.ts"

const html = String;
const crypto = new Peko.Krypto("SUPER_SECRET_KEY_123"); // TODO: replace with env var

// TODO: replace with db / auth provider query
const user = {
  username: "test-user",
  password: await crypto.hash("test-password"),
};

type JWTPayload = {
  iat: number,
  exp: number,
  data: { user: string },
}

const validateUser = async (username: string, password: string) => {
  return (
    username &&
    password &&
    username === user.username &&
    (await crypto.hash(password)) === user.password
  );
};

class SimpleAuthRouter extends Peko.HttpRouterFactory({
  middleware: [
    Peko.log(console.log)
  ]
}) {
  login = this.POST("/login", async (ctx) => {
    const { username, password } = await ctx.request.json();

    if (!(await validateUser(username, password))) {
      return new Response("Bad credentials", { status: 401 });
    }

    const exp = new Date();
    exp.setMonth(exp.getMonth() + 1);
    const jwtPayload: JWTPayload = {
    iat: Date.now(),
    exp: exp.valueOf(),
    data: { user: username },
    }
    const jwt = await crypto.sign(jwtPayload);
    
    return new Response(jwt, {
      status: 201,
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  });

  verify = this.GET(
    "/verify",
    [Peko.auth<JWTPayload>(crypto)],
    (ctx) => {
      console.log(ctx.state.auth)
      return ctx.state.auth 
        ? new Response(`You are authenticated as ${ctx.state.auth.data.user}`)
        : new Response("You are not authenticated", {
          status: 401
        })
      }
  );

  authPage = this.GET(
    "/",
    Peko.ssr(
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
                const response = await fetch("/login", {
                  method: "POST",
                  body: JSON.stringify({
                    username: email.value,
                    password: password.value,
                  }),
                });

                jwt = await response.text();
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
                const response = await fetch("/verify", {
                  headers: new Headers({
                    Authorization: "Bearer " + jwt,
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
        </html> `
    )
  );
}

export default new SimpleAuthRouter();
