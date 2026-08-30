import PaymentModeForm from '@/views/payment/modes/PaymentModeForm'
import AddItem from '@/utils/forms/create'
import { PaymentModeSaveDocument } from '@/gql/graphql'

const PaymentModeAdd = (props: any) => (
  <AddItem
    mutation={PaymentModeSaveDocument}
    form={<PaymentModeForm {...props} />}
  />
)

export default PaymentModeAdd
