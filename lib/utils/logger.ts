import { getConfig } from "../config.ts"
import { RequestEvent } from "../types.ts"

export const logRequest = async (request: Request, status: number, start: number, responseTime: number) => await new Promise((resolve: (value: void) => void) => {
  const config = getConfig()
  
  const headers: Record<string, string> = {}
  for (const pair of request.headers.entries()) {
      headers[pair[0]] = pair[1]
  }

  const requestEvent: RequestEvent = {
      date: new Date(start).toString(),
      status,
      method: request.method,
      url: request.url,
      responseTime: `${responseTime}ms`,
      headers
  }

  try {
      config.logString(`[${requestEvent.date}] ${requestEvent.status} ${requestEvent.method} ${requestEvent.url} ${requestEvent.responseTime}`)
  } catch (error) {
      console.log(error)
  }

  try {
      config.logEvent(requestEvent)
  } catch (error) {
      console.log(error)
  }
  
  
  resolve()
})