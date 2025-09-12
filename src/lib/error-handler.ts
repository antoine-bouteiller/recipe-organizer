import * as Sentry from '@sentry/tanstackstart-react'

export const withServerErrorCapture =
  <TContext, TResult>(handler: (ctx: TContext) => TResult | Promise<TResult>) =>
  async (ctx: TContext): Promise<TResult> => {
    try {
      return await handler(ctx)
    } catch (error) {
      Sentry.captureException(error)
      throw new Error('Une erreur est survenue')
    }
  }
