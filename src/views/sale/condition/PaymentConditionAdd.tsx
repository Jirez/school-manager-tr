import { PaymentConditionSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import PaymentConditionForm from './PaymentConditionForm'

const PaymentConditionAdd = (props: any) => (
  <AddItem
    mutation={PaymentConditionSaveDocument}
    form={<PaymentConditionForm {...props} />}
  />
)

export default PaymentConditionAdd
