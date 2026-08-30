import DepartmentForm from '@/views/payroll/department/DepartmentForm'
import AddItem from '@/utils/forms/create'
import { DepartmentSaveDocument } from '@/gql/graphql'

const DepartmentAdd = (props: any) => (
  <AddItem
    mutation={DepartmentSaveDocument}
    form={<DepartmentForm {...props} />}
  />
)

export default DepartmentAdd
