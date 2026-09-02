import Enrollment from '#/views/school/frequent/show/Enrollment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(student)/frequents/$id',
)({
  component: EnrollmentPage,
  staticData: {
    meta: {
      resource: 'student',
    },
  },
})

function EnrollmentPage() {
  const { id } = Route.useParams()
  return <Enrollment id={id} />
}
