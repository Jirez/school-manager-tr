import {
  SchoolOfficialDeleteDocument,
  SchoolOfficialsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SchoolOfficialDelete = (props: any) => (
  <DeleteItem
    mutation={SchoolOfficialDeleteDocument}
    query={SchoolOfficialsDocument}
    listVar="schoolOfficials"
    {...props}
  />
)

export default SchoolOfficialDelete
