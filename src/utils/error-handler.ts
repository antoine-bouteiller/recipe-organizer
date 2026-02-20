import { isNotFound, isRedirect } from '@tanstack/react-router'
import { ValiError } from 'valibot'

export const withServerError =
  <TContext, TResult>(handler: (ctx: TContext) => Promise<TResult> | TResult) =>
  async (ctx: TContext): Promise<TResult> => {
    try {
      return await handler(ctx)
    } catch (error) {
      if (isNotFound(error) || isRedirect(error)) {
        throw error
      }

      if (error instanceof ValiError) {
        throw new Error(`Invalid Schema; ${error.message}`, { cause: error })
      }

      let errorMessage = ''

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = JSON.stringify(error)
      }

      // oxlint-disable-next-line no-console
      console.error('Internal Server Error :', errorMessage)

      throw new Error('Une erreur est survenue', { cause: error })
    }
  }
