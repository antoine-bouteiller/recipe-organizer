import { Icon, LucideHome, type IconNode } from 'lucide-react'

const homeFilledNode: IconNode = [
  [
    'path',
    {
      d: 'M5 21a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-7a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v7a1 1 0 0 1-1 1z',
      fill: 'currentColor',
      key: '1xsl9c',
    },
  ],
]

export const HomeIcon = ({ className, filled }: { className?: string; filled?: boolean }) => {
  if (filled) {
    return <Icon name="home" className={className} iconNode={homeFilledNode} />
  }
  return <LucideHome name="home" className={className} />
}
