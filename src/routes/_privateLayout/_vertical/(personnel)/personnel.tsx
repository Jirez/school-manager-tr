import Personnel from '#/views/school/teacher'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(personnel)/personnel',
)({
  component: Personnel,
  staticData: {
    meta: {
      resource: 'teacher',
    },
  },
})
