import {
  PaymentSliceDeleteDocument,
  PaymentSlicesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PaymentSliceDelete = (props: any) => (
  <DeleteItem
    mutation={PaymentSliceDeleteDocument}
    query={PaymentSlicesDocument}
    listVar="paymentSlices"
    {...props}
  />
)

export default PaymentSliceDelete
