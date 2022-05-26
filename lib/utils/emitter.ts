import { Listener, Emitter, Event } from "../types.ts"

const emitters: Emitter[] = []

export const createEmitter = (id: string, ) => {
  const listeners: Listener[] = []
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

  const emit = (e: Event) => listeners.forEach(listener => listener(e))
  const emitter = { id, emit, getListeners, subscribe, unsubscribe }

  emitters.push(emitter)
  return emitter
}