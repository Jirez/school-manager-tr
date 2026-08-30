import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/annual-comp-average',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_privateLayout/_vertical/(note)/annual-comp-average"!</div>
  )
}
