import SequentialNotes from '#/views/mark/sequentialNotes/SequentialNotes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/sequential-notes',
)({
  component: SequentialNotes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
