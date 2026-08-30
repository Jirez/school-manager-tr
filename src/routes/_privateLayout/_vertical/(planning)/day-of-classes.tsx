import DayOfClass from '#/views/planning/dayOfClass'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(planning)/day-of-classes',
)({
  component: DayOfClass,
  staticData: {
    meta: {
      resource: 'planning',
    },
  },
})
