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

/** A request body that failed validation; `errors` maps each dotted body path to its message. */
export class FieldValidationError extends Error {
  override readonly name = 'FieldValidationError'
  readonly errors: Record<string, string>

  constructor(errors: Record<string, string>) {
    super('Invalid Schema')
    this.errors = errors
  }
}
