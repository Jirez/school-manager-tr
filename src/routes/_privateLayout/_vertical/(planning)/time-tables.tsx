import TimeTables from '#/views/planning/timeTable/TimeTables'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(planning)/time-tables',
)({
  component: TimeTables,
  staticData: {
    meta: {
      resource: 'planning',
    },
  },
})
