import {
  SubjectDepartmentDeleteDocument,
  SubjectDepartmentsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SubjectDepartmentDelete = (props: any) => (
  <DeleteItem
    mutation={SubjectDepartmentDeleteDocument}
    query={SubjectDepartmentsDocument}
    listVar="subjectDepartments"
    classic={true}
    {...props}
  />
)

export default SubjectDepartmentDelete
