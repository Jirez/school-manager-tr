import { toCurrency } from '@/utils/helpers'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import PaymentInfoItem from './PaymentInfoItem'
import { FileText, AlertCircle, Receipt, CheckCircle2 } from 'lucide-react'

interface PaymentInfoProps {
  estimate: number
  estimateCount: number
  overdue: number
  overdueCount: number
  openInvoice: number
  openInvoiceCount: number
  paid: number
  paidCount: number
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  //margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  estimate,
  overdue,
  openInvoice,
  paid,
  estimateCount,
  overdueCount,
  openInvoiceCount,
  paidCount,
}) => {
  const { t } = useTranslation()

  return (
    <Container>
      <PaymentInfoItem
        amount={toCurrency(estimate)}
        label={t('label-estimate')}
        count={estimateCount}
        icon={FileText}
        color="#3b82f6"
        bgColor="rgba(59, 130, 246, 0.1)"
        borderColor="rgba(59, 130, 246, 0.3)"
      />

      <PaymentInfoItem
        amount={toCurrency(overdue)}
        label={t('label-overdue')}
        count={overdueCount}
        icon={AlertCircle}
        color="#ea580c"
        bgColor="rgba(234, 88, 12, 0.1)"
        borderColor="rgba(234, 88, 12, 0.3)"
      />

      <PaymentInfoItem
        amount={toCurrency(openInvoice)}
        label={t('label-openInvoice')}
        count={openInvoiceCount}
        icon={Receipt}
        color="#6b7280"
        bgColor="rgba(107, 114, 128, 0.1)"
        borderColor="rgba(107, 114, 128, 0.3)"
      />

      <PaymentInfoItem
        amount={toCurrency(paid)}
        label={t('label-donePayment')}
        count={paidCount}
        icon={CheckCircle2}
        color="#16a34a"
        bgColor="rgba(22, 163, 74, 0.1)"
        borderColor="rgba(22, 163, 74, 0.3)"
      />
    </Container>
  )
}

export default PaymentInfo
