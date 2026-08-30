import SetupWizard from '#/views/school/setup/SetupWizard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/guided-setup',
)({
  component: SetupWizard,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
