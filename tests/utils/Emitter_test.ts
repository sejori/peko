import { assert } from "https://deno.land/std@0.147.0/testing/asserts.ts"
import { Event, Emitter } from "../../mod.ts"

Deno.test("UTIL: EMITTER", async (t) => {
  const eventArray: Event[] = []
  const testFcn = (e: Event) => eventArray.push(e)
  const testData = { test: "test" }

  const emitter = new Emitter()
  const emitterPrepop = new Emitter(testFcn)
  
  await t.step("test emitter is created as expected", async () => {
    assert(!emitter.listeners[0])
    assert(emitterPrepop.listeners[0] === testFcn)
  })

  await t.step("test emit", async () => {
    emitterPrepop.emit(testData)
    assert(eventArray.find(e => e.data === testData))
  })

  await t.step("test listener subscribe", async () => {
    eventArray.splice(0,1)
    emitter.subscribe(testFcn)
    emitter.emit(testData)
    assert(eventArray.find(e => e.data === testData))
  })

  await t.step("test listener unsubscribe", async () => {
    eventArray.splice(0,1)
    emitter.unsubscribe(testFcn)
    emitter.emit(testData)
    assert(!eventArray.find(e => e.data === testData))
  })
})