export const typedEntriesOf = <TObj extends object>(obj: TObj) => Object.entries(obj) as [keyof TObj, TObj[keyof TObj]][]
