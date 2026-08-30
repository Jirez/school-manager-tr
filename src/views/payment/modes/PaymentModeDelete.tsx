import { PaymentModeDeleteDocument, PaymentModesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PaymentModeDelete = (props: any) => (
  <DeleteItem
    mutation={PaymentModeDeleteDocument}
    query={PaymentModesDocument}
    listVar="paymentModes"
    {...props}
  />
)

export default PaymentModeDelete
