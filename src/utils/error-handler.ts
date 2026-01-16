import { ArkErrors } from 'arktype'

export const withServerError =
  <TContext, TResult>(handler: (ctx: TContext) => Promise<TResult> | TResult) =>
  async (ctx: TContext): Promise<TResult> => {
    try {
      return await handler(ctx)
    } catch (error) {
      if (error instanceof ArkErrors) {
        throw new Error(`Invalid Schema; ${error.summary}`, { cause: error })
      }
      throw new Error('Une erreur est survenue', { cause: error })
    }
  }
