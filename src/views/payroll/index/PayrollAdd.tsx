import { PayrollSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import PayrollForm from './PayrollForm'

const PayrollAdd = (props: any) => (
  <AddItem mutation={PayrollSaveDocument} form={<PayrollForm {...props} />} />
)

export default PayrollAdd
