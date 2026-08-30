import Students from '#/views/school/students'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/students',
)({
  component: Students,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})
