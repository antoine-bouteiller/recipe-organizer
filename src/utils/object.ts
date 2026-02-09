export const typedEntriesOf = <T extends object>(obj: T) => Object.entries(obj) as [keyof T, T[keyof T]][]
