import PayrollPeriodForm from './PayrollPeriodForm'
import AddItem from '@/utils/forms/create'
import { PayrollPeriodSaveDocument } from '@/gql/graphql'

const PayrollPeriodAdd = (props: any) => (
  <AddItem
    mutation={PayrollPeriodSaveDocument}
    form={<PayrollPeriodForm {...props} />}
  />
)

export default PayrollPeriodAdd
