import SequentialNoteTemplate from '#/views/mark/sequentialNotes/SequentialNoteTemplate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-note-template',
)({
  component: SequentialNoteTemplate,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
