import {
  PaymentGroupDeleteDocument,
  PaymentGroupsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PaymentGroupDelete = (props: any) => (
  <DeleteItem
    mutation={PaymentGroupDeleteDocument}
    query={PaymentGroupsDocument}
    listVar="paymentGroups"
    {...props}
  />
)

export default PaymentGroupDelete
