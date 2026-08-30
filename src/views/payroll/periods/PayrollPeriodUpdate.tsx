import UpdateItem from '@/utils/forms/edit'
import PayrollPeriodForm from './PayrollPeriodForm'
import { PayrollPeriodUpdateDocument } from '@/gql/graphql'

const PayrollPeriodUpdate = (props: any) => (
  <UpdateItem
    mutation={PayrollPeriodUpdateDocument}
    form={<PayrollPeriodForm {...props} />}
  />
)

export default PayrollPeriodUpdate
