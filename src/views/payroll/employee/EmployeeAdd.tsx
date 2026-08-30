import EmployeeForm from '@/views/payroll/employee/EmployeeForm'
import AddItem from '@/utils/forms/create'
import { EmployeeSaveDocument } from '@/gql/graphql'

const EmployeeAdd = (props: any) => (
  <AddItem mutation={EmployeeSaveDocument} form={<EmployeeForm {...props} />} />
)

export default EmployeeAdd
