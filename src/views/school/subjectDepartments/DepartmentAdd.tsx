import DepartmentForm from '@/views/school/subjectDepartments/DepartmentForm'
import AddItem from '@/utils/forms/create'
import { SubjectDepartmentSaveDocument } from '@/gql/graphql'

const DepartmentAdd = (props: any) => (
  <AddItem
    mutation={SubjectDepartmentSaveDocument}
    form={<DepartmentForm {...props} />}
  />
)

export default DepartmentAdd
