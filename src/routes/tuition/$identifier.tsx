import StudentMobilePaymentEntry from '#/views/sale/mobile/StudentMobilePaymentEntry'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tuition/$identifier')({
  component: () => <StudentMobilePaymentEntryPage />,
})

function StudentMobilePaymentEntryPage() {
  const { identifier } = Route.useParams()
  return <StudentMobilePaymentEntry identifier={identifier} />
}
