import AddItem from '@/utils/forms/create'
import { BillPaymentSaveDocument } from '@/gql/graphql'
import BillPaymentForm from './BillPaymentForm'

const BillPaymentAdd = (props: any) => (
  <AddItem
    mutation={BillPaymentSaveDocument}
    form={<BillPaymentForm {...props} />}
  />
)

export default BillPaymentAdd
