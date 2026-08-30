import PersonnelReport from '#/views/report/personnel/PersonnelReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/personnel_list',
)({
  component: PersonnelReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
