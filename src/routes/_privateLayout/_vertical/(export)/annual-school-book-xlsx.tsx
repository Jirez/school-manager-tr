import AnnualSchoolBook from '#/views/export/notes/AnnualSchoolBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(export)/annual-school-book-xlsx',
)({
  component: AnnualSchoolBook,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
