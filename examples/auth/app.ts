import * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts
import config from "../config.ts"

// Configure Peko
Peko.setConfig(config)

// generate JWT
Peko.addRoute({
  route: "/login",
  method: "GET",
  handler: async () => {
    const exp = new Date()
    exp.setMonth(exp.getMonth() + 1)

    const jwt = await Peko.generateJWT({
      exp: exp.valueOf()
    })

    return new Response(JSON.stringify({ jwt}), {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
  }
})

// verify JWT in auth middleware
Peko.addRoute({
  route: "/authTest",
  method: "GET",
  middleware: Peko.authenticator,
  handler: () => new Response("You are authenticated!")
})

// basic HTML page with buttons to call auth routes
Peko.addRoute({
  route: "/",
  method: "GET",
  handler: () => new Response(`<!doctype html>
    <html lang="en">
    <head>
      <title>Peko auth example</title>
    </head>
    <body style="width: 100vw; height: 100vh; margin: 0; background-color: steelblue">
      <div style="border: 1px solid black; margin: auto; padding: 1rem;">
        <button id="login">Login</button>
        <button onclick="testAuth()">Test Auth</button>
      </div>

      <script>
        const loginBtn = document.querySelector("#login")
        let jwt

        async function login() {
          const response = await fetch("/login")
          console.log(response)

          const json = await response.json()
          jwt = json.jwt
          console.log("jwt: " + jwt)

          loginBtn.textContent = "Logout"
          loginBtn.removeEventListener("click", login)
          loginBtn.addEventListener("click", logout)
        }

        function logout() { 
          jwt = undefined 
          console.log("jwt: " + jwt)

          loginBtn.textContent = "Login"
          loginBtn.removeEventListener("click", logout)
          loginBtn.addEventListener("click", login)
        }

        async function testAuth() {
          const response = await fetch("/authTest", {
            headers: new Headers({
              "Authorization": "Bearer " + jwt
            })
          })
          console.log(response)
        }

        document.querySelector("#login").addEventListener("click", login)
      </script>
    </body>
    </html>
  `, { headers: new Headers({ "Content-Type": "text/html; charset=UTF-8" }) })
})

// Start your Peko server :)
Peko.start()