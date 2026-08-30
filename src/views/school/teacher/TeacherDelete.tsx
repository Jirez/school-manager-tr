import { PersonnelDocument, TeacherDeleteDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const TeacherDelete = (props: any) => (
  <DeleteItem
    mutation={TeacherDeleteDocument}
    query={PersonnelDocument}
    listVar="personnels"
    {...props}
  />
)

export default TeacherDelete
