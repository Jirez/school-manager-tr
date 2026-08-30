import AnnualSchoolBook from '#/views/report/noteBooks/AnnualSchoolBook'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/annual_school_book',
)({
  component: AnnualSchoolBook,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
