import type { MagimixProgramData } from '@/types/magimix'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    magimixProgram: {
      /**
       * Insert a Magimix program node
       */
      setMagimixProgram: (attributes: MagimixProgramData) => ReturnType
    }
  }
}
