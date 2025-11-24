export const withServerErrorCapture =
  <TContext, TResult>(handler: (ctx: TContext) => TResult | Promise<TResult>) =>
  async (ctx: TContext): Promise<TResult> => {
    try {
      return await handler(ctx)
    } catch (error) {
      throw new Error('Une erreur est survenue', { cause: error })
    }
  }
