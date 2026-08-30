import { BranchDeleteDocument, BranchesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const BranchDelete = (props: any) => (
  <DeleteItem
    mutation={BranchDeleteDocument}
    query={BranchesDocument}
    listVar="branches"
    singleVar="branch"
    {...props}
  />
)

export default BranchDelete
