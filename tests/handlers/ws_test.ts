import { assert } from "https://deno.land/std@0.174.0/testing/asserts.ts"
import { Server } from "../../lib/server.ts"
import { wsHandler } from "../../lib/handlers/ws.ts"

Deno.test("HANDLER: WebSocket", async (t) => {
  const server = new Server()
  const sockets: Map<string, WebSocket> = new Map()
  const client_messages: string[] = []

  server.addRoute("/ws", wsHandler((socket) => {
    const socketID = crypto.randomUUID()
    socket.addEventListener("open", () => sockets.set(socketID, socket))
    socket.addEventListener("message", (e) => client_messages.push(e.data))
    socket.addEventListener("close", () => sockets.delete(socketID))
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

    while (!client_messages[0]) await new Promise(res => setTimeout(res, 100))
    assert(client_messages[0] === test_string)

    socket.close()
    await closePromise(socket)
  })

  await t.step("messages sent to clients as expected", async () => {
    const socket1 = new WebSocket("ws://localhost:3000/ws")
    const socket2 = new WebSocket("ws://localhost:3000/ws")
    const socket3 = new WebSocket("ws://localhost:3000/ws")
    await openPromise(socket3)

    const messages: string[] = []
    socket1.addEventListener("message", (e) => messages[0] = e.data)
    socket2.addEventListener("message", (e) => messages[1] = e.data)
    socket3.addEventListener("message", (e) => messages[2] = e.data)

    const test_string = "I am the greatest."
    sockets.forEach(socket => socket.send(test_string))

    while (messages.length < 3) await new Promise(res => setTimeout(res, 100))
    assert(messages.length === 3 && messages.every(message => message === test_string))

    socket1.close()
    await closePromise(socket1)
    socket2.close()
    await closePromise(socket2)
    socket3.close()
    await closePromise(socket3)
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