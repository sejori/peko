import { Listener, Emitter, Event } from "../types.ts"
import { getConfig } from "../config.ts"

const emitters: Emitter[] = []

export const createEmitter = (id: string, initListeners?: Listener[]) => {
  const config = getConfig()
  const listeners: Listener[] = initListeners ? initListeners : []
  const getListeners = () => listeners

  const subscribe = (listener: Listener) => {
    listeners.push(listener)
    return true
  }

  const unsubscribe = (listener: Listener) => {
    // convert listener function bodies to strings for comparison
    const emListener = listeners.find(li => li.toString() === listener.toString())
    if (emListener) {
      listeners.splice(listeners.indexOf(emListener), 1)
      return true
    }
    return false
  }

  // async so won't block process when called without "await"
  // TODO: do we handle erros as events? is that too opinionated?
  const emit = async (data: Record<string, any>) => {
    const date = new Date()
    const event: Event = { id: `EMIT-${id}-${date.toJSON()}`, type: "emit", date: date, data }
    listeners.forEach(listener => listener(event))
    await config.logEvent(event)
  }

  const emitter = { id, emit, getListeners, subscribe, unsubscribe }

  emitters.push(emitter)
  return emitter
}