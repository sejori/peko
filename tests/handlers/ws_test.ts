import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server } from "../../lib/server.ts"
import { wsHandler } from "../../lib/handlers/ws.ts"

Deno.test("HANDLER: WebSocket", async (t) => {
  const server = new Server()
  // const sockets: Map<string, WebSocket> = new Map()
  let message = ""

  server.addRoute("/ws", wsHandler((socket) => {
    // socket.addEventListener("open", (e) => console.log(e))
    socket.addEventListener("message", (e) => message = e.data)
    // socket.addEventListener("close", () => console.log("socket closed"))
  }))

  server.listen(3000, () => null)

  await t.step("Socket created and closed as expected", async () => {
    const socket = new WebSocket("ws://localhost:3000/ws")
    assert(await openPromise(socket))

    socket.close()

    assert(await closePromise(socket))
  })

  await t.step("messages received from client as expected", async () => {
    const socket = new WebSocket("ws://localhost:3000/ws")
    await openPromise(socket)

    const test_string = "why hello my friend!"
    socket.send(test_string)

    while (!message) await new Promise(res => setTimeout(res, 100))
    assert(message === test_string)

    socket.close()
    await closePromise(socket)
  })

  server.close()
});

function openPromise(conn: WebSocket): Promise<boolean> {
  return new Promise(resolve => {
    conn.addEventListener("open", () => {
      resolve(true);
    });
  });
}

function closePromise(conn: WebSocket): Promise<boolean> {
  return new Promise(resolve => {
    conn.addEventListener("close", () => {
      resolve(true);
    });
  });
}