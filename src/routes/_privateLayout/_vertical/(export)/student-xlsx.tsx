import StudentXSSF from '#/views/export/school/StudentXSSF'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(export)/student-xlsx',
)({
  component: StudentXSSF,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
