import { EmployeeDeleteByIdDocument, EmployeesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const EmployeeDelete = (props: any) => (
  <DeleteItem
    mutation={EmployeeDeleteByIdDocument}
    query={EmployeesDocument}
    listVar="employees"
    singleVar="employee"
    {...props}
  />
)

export default EmployeeDelete
