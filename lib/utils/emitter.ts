import { Listener, Emitter, Event } from "../types.ts"
import { logError } from "./logger.ts"

const emitters: Emitter[] = []

export const createEmitter = (initListeners?: Listener[]) => {
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
  const emit = async (data: Record<string, any>) => {
    const date = new Date()
    const eventId = `EMIT-${JSON.stringify(data)}-${date.toJSON()}`
    const event: Event = { id: eventId, type: "emit", date: date, data }
    
    try {
      return await Promise.all(listeners.map(async listener => await listener(event)))
    } catch (error) {
      logError(eventId, error, date)
    }
  }

  const emitter = { emit, getListeners, subscribe, unsubscribe }

  emitters.push(emitter)
  return emitter
}