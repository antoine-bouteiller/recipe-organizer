export const getTitle = (data: FormData) => {
  const title = data.get('name')

  return typeof title === 'string' ? title : ''
}
