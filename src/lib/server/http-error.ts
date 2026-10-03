/** An expected request failure; `toApiErrorResponse` and Void's fallback error handler keep its status. */
export class HttpError extends Error {
  override readonly name = 'HttpError'
  readonly status: number

  constructor(status: number, message = '') {
    super(message)
    this.status = status
  }

  getResponse(): Response {
    return new Response(this.message, { status: this.status })
  }
}
