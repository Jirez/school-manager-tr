import QuarterlyNoteBook from '#/views/report/noteBooks/QuarterlyNoteBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/quarterly_note_book',
)({
  component: QuarterlyNoteBook,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
