import { isNotFound, isRedirect } from '@tanstack/react-router'
import { ZodError } from 'zod'

export const withServerError =
  <TContext, TResult>(handler: (ctx: TContext) => Promise<TResult> | TResult) =>
  async (ctx: TContext): Promise<TResult> => {
    try {
      return await handler(ctx)
    } catch (error) {
      if (isNotFound(error) || isRedirect(error)) {
        throw error
      }

      if (error instanceof ZodError) {
        throw new Error(`Invalid Schema; ${error.message}`, { cause: error })
      }

      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)

      // oxlint-disable-next-line no-console
      console.error('Internal Server Error :', errorMessage)

      throw new Error('Une erreur est survenue', { cause: error })
    }
  }
