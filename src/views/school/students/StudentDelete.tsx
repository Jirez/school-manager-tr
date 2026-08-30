import {
  StudentDeleteDocument,
  UnregisteredStudentsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const StudentDelete = (props: any) => (
  <DeleteItem
    mutation={StudentDeleteDocument}
    query={UnregisteredStudentsDocument}
    listVar="students"
    updateCache={false}
    {...props}
  />
)

export default StudentDelete
