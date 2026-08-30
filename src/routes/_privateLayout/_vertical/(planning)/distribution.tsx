import ClassDistribution from '#/views/planning/distributions/ClassDistribution'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(planning)/distribution',
)({
  component: ClassDistribution,
  staticData: {
    meta: {
      resource: 'planning',
    },
  },
})
