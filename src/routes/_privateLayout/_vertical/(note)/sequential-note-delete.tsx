import DeleteNote from '#/views/mark/sequentialNotes/DeleteNote'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-note-delete',
)({
  component: DeleteNote,
  staticData: {
    meta: {
      resource: 'note',
      action: 'delete',
    },
  },
})
