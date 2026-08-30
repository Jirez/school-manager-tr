import { PaymentConditionUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import PaymentConditionForm from './PaymentConditionForm'

const PaymentConditionUpdate = (props: any) => (
  <UpdateItem
    mutation={PaymentConditionUpdateDocument}
    form={<PaymentConditionForm {...props} />}
  />
)

export default PaymentConditionUpdate
