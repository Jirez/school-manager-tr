import { SubjectDeleteDocument, SubjectsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SubjectDelete = (props: any) => (
  <DeleteItem
    mutation={SubjectDeleteDocument}
    query={SubjectsDocument}
    listVar="subjects"
    {...props}
  />
)

export default SubjectDelete
