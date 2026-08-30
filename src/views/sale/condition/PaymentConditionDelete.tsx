import {
  PaymentConditionDeleteDocument,
  PaymentConditionsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PaymentConditionDelete = (props: any) => (
  <DeleteItem
    mutation={PaymentConditionDeleteDocument}
    query={PaymentConditionsDocument}
    listVar="paymentConditions"
    singleVar="paymentCondition"
    {...props}
  />
)

export default PaymentConditionDelete
