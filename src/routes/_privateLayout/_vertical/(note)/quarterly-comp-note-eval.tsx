import QuarterlyCompNoteFromEval from '#/views/mark/quarterlyCompNotes/QuarterlyCompNoteFromEval'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/quarterly-comp-note-eval',
)({
  component: QuarterlyCompNoteFromEval,
  staticData: {
    meta: {
      resource: 'config',
    },
  },
})
