import QuarterlyNotes from '#/views/mark/quarterlyNotes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/quarterly-notes',
)({
  component: QuarterlyNotes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
