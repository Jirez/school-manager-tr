import TimeSlots from '#/views/planning/timeSlot'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(planning)/time-slots',
)({
  component: TimeSlots,
  staticData: {
    meta: {
      resource: 'planning',
    },
  },
})
