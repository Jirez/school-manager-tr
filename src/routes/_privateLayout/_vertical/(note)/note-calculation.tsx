import NoteCalculation from '#/views/mark/calculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(note)/note-calculation',
)({
  component: NoteCalculation,
  staticData: {
    meta: {
      resource: 'note',
    },
  },
})
