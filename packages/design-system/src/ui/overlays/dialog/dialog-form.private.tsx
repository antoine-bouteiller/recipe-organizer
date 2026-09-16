import { createContext, useContext, type ReactNode } from 'react'

export interface DialogFormFrame {
  wrap: (content: ReactNode) => ReactNode
}

const DialogFormContext = createContext<DialogFormFrame | null>(null)

export const DialogFormProvider = DialogFormContext.Provider
export const useDialogFormFrame = (): DialogFormFrame | null => useContext(DialogFormContext)
