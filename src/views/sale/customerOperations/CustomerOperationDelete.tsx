import { useAbility } from '@/context/Can'
import InvoiceDelete from '@/views/sale/invoice/InvoiceDelete'
import PaymentDelete from '@/views/sale/payment/PaymentDelete'

const CustomerOperationDelete = (props: any) => {
  const ability = useAbility()

  if (
    (props.type === 'INVOICE' || props.type === 'SCHOOL_FEES') &&
    ability.can('delete', 'invoice')
  ) {
    return <InvoiceDelete {...props} />
  } else if (props.type === 'PAYMENT' && ability.can('delete', 'payment')) {
    return <PaymentDelete {...props} />
  }

  return <span />
}

export default CustomerOperationDelete
