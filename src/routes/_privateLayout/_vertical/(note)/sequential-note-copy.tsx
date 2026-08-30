import SequentialNoteCopy from '#/views/mark/sequentialNotes/SequentialNoteCopy'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-note-copy',
)({
  component: SequentialNoteCopy,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
