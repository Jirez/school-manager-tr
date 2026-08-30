import DowngradeSubject from '#/views/mark/sequentialNotes/DowngradeSubject'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-note-downgrade',
)({
  component: DowngradeSubject,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
