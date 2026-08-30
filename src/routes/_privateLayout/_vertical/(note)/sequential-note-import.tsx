import ImportSequentialNote from '#/views/mark/sequentialNotes/ImportSequentialNote'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-note-import',
)({
  component: ImportSequentialNote,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
