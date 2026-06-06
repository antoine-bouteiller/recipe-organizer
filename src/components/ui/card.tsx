import { Card as CardRoot, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from './primitive/card'

const Card = Object.assign(CardRoot, {
  Description: CardDescription,
  Footer: CardFooter,
  Header: CardHeader,
  Panel: CardPanel,
  Title: CardTitle,
})

export { Card }
