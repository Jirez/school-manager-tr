import InvoiceReport from '#/views/report/payment/InvoiceReport'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/invoice_report',
)({
  component: InvoiceReport,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
