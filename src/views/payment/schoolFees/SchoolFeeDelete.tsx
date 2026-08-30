import { SchoolFeeDeleteDocument, SchoolFeesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SchoolFeeDelete = (props: any) => (
  <DeleteItem
    mutation={SchoolFeeDeleteDocument}
    query={SchoolFeesDocument}
    listVar="schoolFees"
    {...props}
  />
)

export default SchoolFeeDelete
