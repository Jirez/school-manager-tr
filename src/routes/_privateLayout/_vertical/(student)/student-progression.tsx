import StudentProgression from '#/views/school/frequent/StudentProgression'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/student-progression',
)({
  component: StudentProgression,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
