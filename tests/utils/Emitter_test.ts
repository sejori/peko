import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Emitter } from "../../mod.ts"

Deno.test("UTIL: Emitter", async (t) => {
  const dataArray: unknown[] = []
  const testFcn = (e: unknown) => dataArray.push(e)
  const testData = { test: "test" }

  const emitter = new Emitter()
  const emitterPrepop = new Emitter(testFcn)
  
  await t.step("test emitter is created as expected", () => {
    assert(!emitter.listeners[0])
    assert(emitterPrepop.listeners[0] === testFcn)
  })

  await t.step("test emit", () => {
    emitterPrepop.emit(testData)
    assert(dataArray.find(data => data === testData))
  })

  await t.step("test listener subscribe", () => {
    dataArray.splice(0,1)
    emitter.subscribe(testFcn)
    emitter.emit(testData)
    assert(dataArray.find(data => data === testData))
  })

  await t.step("test listener unsubscribe", () => {
    dataArray.splice(0,1)
    emitter.unsubscribe(testFcn)
    emitter.emit(testData)
    assert(!dataArray.find(data => data === testData))
  })
})