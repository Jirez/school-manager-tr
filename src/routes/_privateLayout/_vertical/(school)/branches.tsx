import Branches from '#/views/school/branches'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/branches',
)({
  component: Branches,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
