/** Void converts a returned `null` to `204 No Content`; this answers JSON `null` instead while keeping `null` in the route's output type. */
export const jsonNullable = <TValue>(value: TValue | null | undefined): TValue | Response | null => value ?? Response.json(null)
