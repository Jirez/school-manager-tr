import PaymentGroupForm from '@/views/payment/groups/PaymentGroupForm'
import AddItem from '@/utils/forms/create'
import { PaymentGroupSaveDocument } from '@/gql/graphql'

const PaymentGroupAdd = (props: any) => (
  <AddItem
    mutation={PaymentGroupSaveDocument}
    form={<PaymentGroupForm {...props} />}
  />
)

export default PaymentGroupAdd
