import AnnualNotes from '#/views/mark/annualNotes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/annual-notes',
)({
  component: AnnualNotes,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
