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

      // oxlint-disable-next-line no-console
      console.error(error)

      throw new Error('Une erreur est survenue', { cause: error })
    }
  }
