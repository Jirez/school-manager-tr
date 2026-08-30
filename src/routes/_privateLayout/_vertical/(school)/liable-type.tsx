import OfficialFunctions from '#/views/school/officialFunctions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/liable-type',
)({
  component: OfficialFunctions,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
