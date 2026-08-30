import SequentialNoteBook from '#/views/report/noteBooks/SequentialNoteBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/sequential_note_book',
)({
  component: SequentialNoteBook,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
