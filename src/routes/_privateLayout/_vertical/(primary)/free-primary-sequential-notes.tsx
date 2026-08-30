import PFreeSequentialNotes from '#/views/primary/note/sequential/free/PFreeSequentialNotes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(primary)/free-primary-sequential-notes',
)({
  component: PFreeSequentialNotes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
