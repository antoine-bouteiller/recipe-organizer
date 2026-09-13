import * as z from 'zod'

export const userSchema = z.object({
  email: z.email(),
  role: z.enum(['user', 'admin']),
})

const userStatusSchema = z.enum(['pending', 'active', 'blocked'])
export const getUsersListSchema = z.object({ status: userStatusSchema.default('active') })
export const userIdSchema = z.object({ id: z.string() })

export type UserStatus = z.infer<typeof userStatusSchema>
export type UserFormValues = z.infer<typeof userSchema>
export type UserFormInput = Partial<UserFormValues>
