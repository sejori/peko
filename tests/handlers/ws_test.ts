import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Server } from "../../server.ts"
import { wsHandler } from "../../handlers/ws.ts"

Deno.test("HANDLER: WebSocket", async (t) => {
  const server = new Server()
  const eventTarget = new EventTarget()

  server.addRoute("/ws", wsHandler(eventTarget))

  const testData = {
    foo: "bar"
  }

  const awaitOpen = (conn: WebSocket): Promise<boolean> => {
    return new Promise(resolve => {
      conn.addEventListener("open", () => {
        resolve(true);
      });
    });
  };

  const awaitResponse = (conn: WebSocket): Promise<MessageEvent> => {
    return new Promise(resolve => {
      conn.addEventListener("message", (event) => {
        resolve(event);
      });
    });
  }

  const awaitClose = (conn: WebSocket): Promise<boolean> => {
    return new Promise(resolve => {
      conn.addEventListener("close", () => {
        resolve(true);
      });
    });
  };

  await t.step("Socket created and message events received as expected", async () => {
    server.listen(3000, () => null)

    const socket = new WebSocket("ws://localhost:3000/ws")
    assert(await awaitOpen(socket))

    const dataEvent = new CustomEvent("send", { detail: testData })
    eventTarget.dispatchEvent(dataEvent);

    const message = await awaitResponse(socket)

    assert(JSON.parse(message.data).foo && JSON.parse(message.data).foo === "bar")

    socket.close()
    assert(socket.CLOSED)

    server.close()
  })

  await t.step("send from client and socket.close() works as expected", async () => {
    server.listen(3000, () => null)

    const test_string = "why hello my friend!"
    
    const socket = new WebSocket("ws://localhost:3000/ws")
    assert(await awaitOpen(socket))

    const event: MessageEvent = await new Promise(res => {
      eventTarget.addEventListener("message", (e: Event) => res(e as MessageEvent))

      socket.send(test_string)
    })

    assert(event.data === test_string)

    socket.close()
    assert(await awaitClose(socket))

    server.close()
  })
})