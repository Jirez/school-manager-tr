import CloneConfig from '#/views/school/school/CloneConfig'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/copyOfParameters',
)({
  component: CloneConfig,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
