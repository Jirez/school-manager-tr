import PaymentSliceForm from '@/views/payment/slices/PaymentSliceForm'
import AddItem from '@/utils/forms/create'
import { PaymentSliceSaveDocument } from '@/gql/graphql'

const PaymentSliceAdd = (props: any) => (
  <AddItem
    mutation={PaymentSliceSaveDocument}
    form={<PaymentSliceForm {...props} />}
  />
)

export default PaymentSliceAdd
