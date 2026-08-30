import QuarterlyCompNotes from '#/views/mark/quarterlyCompNotes/QuarterlyCompNotes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/quarterly-comp-note',
)({
  component: QuarterlyCompNotes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
