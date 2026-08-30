import CouncilDecisions from '#/views/school/councilDecisions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/council-decision',
)({
  component: CouncilDecisions,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
