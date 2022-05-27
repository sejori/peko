import { getConfig } from "../config.ts"
import { Event } from "../types.ts"

/**
 * Peko's internal logging function.
 * 
 * Returns promise so process isn't blocked when called without "await" keyword.
 * 
 * @param request: Request
 * @param status: number
 * @param start: number
 * @param responseTime: number
 * @returns Promise<void>
 */
export const logRequest = async (request: Request, status: number, start: number, responseTime: number) => {
  const config = getConfig()
  const date = new Date(start)
  const headers: Record<string, string> = {}
  for (const pair of request.headers.entries()) {
      headers[pair[0]] = pair[1]
  }

  const requestEvent: Event = {
      id: `${request.method}-${request.url}-${date.toJSON()}`,
      type: "request",
      date: date,
      data: {
        status,
        responseTime: `${responseTime}ms`,
        request: request
      }
  }

  try {
      await config.logString(`[${requestEvent.date}] ${status} ${request.method} ${request.url} ${requestEvent.data.responseTime}`)
  } catch (error) {
      console.log(error)
  }

  try {
      await config.logEvent(requestEvent)
  } catch (error) {
      console.log(error)
  }
}