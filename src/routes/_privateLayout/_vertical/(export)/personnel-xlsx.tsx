import PersonnelXSSF from '#/views/export/school/PersonnelXSSF'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(export)/personnel-xlsx',
)({
  component: PersonnelXSSF,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
