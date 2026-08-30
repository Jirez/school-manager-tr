import { OldSchoolDeleteDocument, OldSchoolsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const OldSchoolDelete = (props: any) => (
  <DeleteItem
    mutation={OldSchoolDeleteDocument}
    query={OldSchoolsDocument}
    listVar="oldSchools"
    {...props}
  />
)

export default OldSchoolDelete
