import BatchStudentPicture from '#/views/school/students/BatchStudentPicture'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/batch-pictures',
)({
  component: BatchStudentPicture,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})
