import * as Peko from "../../mod.ts" // <- https://deno.land/x/peko/mod.ts

const server = new Peko.Server()
server.use(Peko.logger(console.log))

const crypto = new Peko.Crypto("SUPER_SECRET_KEY_123") // <-- replace from env

// replace with db / auth provider query
const user = {
  username: "test-user",
  password: await crypto.hash("test-password")
}

const validateUser = async (username: string, password: string) => {
  return username && password 
  && username === user.username
  && await crypto.hash(password) === user.password 
}

// generate JWT
server.addRoute({
  path: "/login",
  method: "POST",
  handler: async (ctx) => {
    const { username, password } = await ctx.request.json()

    if (!await validateUser(username, password)) {
      return new Response(null, {status: 400 })
    }

    const exp = new Date()
    exp.setMonth(exp.getMonth() + 1)

    const jwt = await crypto.sign(
      // Payload: { iat: number, exp: number, data: Record<string, undefined> }
      {
        iat: Date.now(),
        exp: exp.valueOf(),
        data: { user: user.username }
      }
    )

    return new Response(jwt, {
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
  }
})

// verify JWT in auth middleware
server.addRoute({
  path: "/authTest",
  middleware: Peko.authenticator(crypto),
  handler: () => new Response("You are authenticated!")
})

// basic HTML page with buttons to call auth routes
server.addRoute({
  path: "/",
  handler: Peko.ssrHandler(() => `<!doctype html>
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
          const response = await fetch("/login", {
            method: "POST",
            body: JSON.stringify({ username: "test-user", password: "test-password" })
          })

          if (response.status !== 200) return alert("Login failed.")

          jwt = await response.text()
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
  `, { 
    crypto
  })
})

// Start Peko server :^)
server.listen()