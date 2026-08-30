import {
  DepartmentDeleteByIdDocument,
  DepartmentsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const DepartmentDelete = (props: any) => (
  <DeleteItem
    mutation={DepartmentDeleteByIdDocument}
    query={DepartmentsDocument}
    listVar="departments"
    singleVar="department"
    {...props}
  />
)

export default DepartmentDelete
