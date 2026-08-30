import OperationClasses from '#/views/core/operationClass'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(expense)/operation-classes',
)({
  component: OperationClasses,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
