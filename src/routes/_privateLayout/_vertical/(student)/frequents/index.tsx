import Frequents from '#/views/school/frequent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/frequents/',
)({
  component: Frequents,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})
