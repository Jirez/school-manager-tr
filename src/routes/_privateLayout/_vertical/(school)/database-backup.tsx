import DatabaseBackup from '#/views/school/tools/DatabaseBackup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(school)/database-backup',
)({
  component: DatabaseBackup,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
