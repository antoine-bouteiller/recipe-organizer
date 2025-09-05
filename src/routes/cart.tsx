import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => (
  <div className="h-full grid place-items-center text-xl font-bold">Comming soon...</div>
)

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})
