export const withServerErrorCapture =
  <TContext, TResult>(handler: (ctx: TContext) => Promise<TResult> | TResult) =>
  async (ctx: TContext): Promise<TResult> => {
    try {
      return await handler(ctx)
    } catch (error) {
      throw new Error('Une erreur est survenue', { cause: error })
    }
  }
