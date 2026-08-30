import Guardians from '#/views/school/guardians'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/guardians',
)({
  component: Guardians,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})
