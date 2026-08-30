import AnnualCompNoteCalculation from '#/views/mark/calculation/AnnualCompNoteCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/annual-comp-note',
)({
  component: AnnualCompNoteCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
