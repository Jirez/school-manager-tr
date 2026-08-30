import BlankNoteBook from '#/views/report/students/BlankNoteBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/blank_note_book',
)({
  component: BlankNoteBook,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
