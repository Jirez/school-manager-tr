import QuarterlyNoteCalculation from '#/views/mark/calculation/QuarterlyNoteCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/quarterly-note',
)({
  component: QuarterlyNoteCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
