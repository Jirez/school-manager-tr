import UpdateItem from '@/utils/forms/edit'
import EmployeeForm from './EmployeeForm'
import { EmployeeUpdateDocument } from '@/gql/graphql'

const EmployeeUpdate = (props: any) => (
  <UpdateItem
    mutation={EmployeeUpdateDocument}
    form={<EmployeeForm {...props} />}
  />
)

export default EmployeeUpdate
