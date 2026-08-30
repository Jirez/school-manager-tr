import { useAbility } from '@/context/Can'
import BillDelete from '../bill/BillDete'
import BillPaymentDelete from '../payment/BillPaymentDelete'

const VendorOperationDelete = (props: any) => {
  const ability = useAbility()

  if (props.type === 'INVOICE' && ability.can('delete', 'invoice')) {
    return <BillDelete {...props} />
  } else if (props.type === 'PAYMENT' && ability.can('delete', 'payment')) {
    return <BillPaymentDelete {...props} />
  }

  return <span />
}

export default VendorOperationDelete
