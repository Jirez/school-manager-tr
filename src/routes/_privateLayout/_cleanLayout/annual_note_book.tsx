import AnnualNoteBook from '#/views/report/noteBooks/AnnualNoteBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_note_book',
)({
  component: AnnualNoteBook,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
