import AnnualNoteCalculation from '#/views/mark/calculation/AnnualNoteCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/annual-note',
)({
  component: AnnualNoteCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
