import FrequentBulk from '#/views/school/frequent/FrequentBulk'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/student-update-by-class',
)({
  component: FrequentBulk,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})
