import PSequentialNotes from '#/views/primary/note/sequential/PSequentialNotes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(primary)/primary-sequential-notes',
)({
  component: PSequentialNotes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
