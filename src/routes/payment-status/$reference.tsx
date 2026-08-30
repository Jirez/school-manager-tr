import StudentMobilePaymentStatus from '#/views/sale/mobile/StudentMobilePaymentStatus'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payment-status/$reference')({
  component: () => <StudentMobilePaymentStatusPage />,
})

function StudentMobilePaymentStatusPage() {
  const { reference } = Route.useParams()
  return <StudentMobilePaymentStatus reference={reference} />
}
