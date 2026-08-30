import { PersonnelDocument, TeachersDeleteDocument } from '@/gql/graphql'
import DeleteAllItem from '@/utils/forms/deleteAll'

const TeachersDelete = (props: any) => (
  <DeleteAllItem
    mutation={TeachersDeleteDocument}
    query={PersonnelDocument}
    listVar="personnels"
    {...props}
  />
)

export default TeachersDelete
