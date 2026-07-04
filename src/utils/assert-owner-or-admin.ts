interface OwnableRow {
  readonly createdBy: string | null
}

interface OwnershipUser {
  readonly id: string
  readonly role: string | null | undefined
}

export const assertOwnerOrAdmin = (user: OwnershipUser, row: OwnableRow): void => {
  if (user.role !== 'admin' && row.createdBy !== user.id) {
    throw new Error('Permission denied')
  }
}
