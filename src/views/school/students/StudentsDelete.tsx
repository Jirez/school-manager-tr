import {
  StudentsDeleteDocument,
  UnregisteredStudentsDocument,
} from '@/gql/graphql'
import DeleteAllItem from '@/utils/forms/deleteAll'

const StudentsDelete = (props: any) => (
  <DeleteAllItem
    mutation={StudentsDeleteDocument}
    query={UnregisteredStudentsDocument}
    listVar="students"
    {...props}
  />
)

export default StudentsDelete
