interface TextSegment {
  bold: boolean
  text: string
}

// `**` pairs toggle bold; a trailing unmatched `**` stays literal.
export const parseBoldText = (text: string): TextSegment[] => {
  const parts = text.split('**')
  if (parts.length % 2 === 0) {
    parts.splice(-2, 2, parts.slice(-2).join('**'))
  }
  return parts.flatMap((part, index) => (part ? [{ bold: index % 2 === 1, text: part }] : []))
}
