import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(misc)/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(misc)/forgot-password"!</div>
}
