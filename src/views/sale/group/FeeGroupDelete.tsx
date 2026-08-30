import { FeeGroupDeleteDocument, FeeGroupsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const FeeGroupDelete = (props: any) => (
  <DeleteItem
    mutation={FeeGroupDeleteDocument}
    query={FeeGroupsDocument}
    listVar="feeGroups"
    {...props}
  />
)

export default FeeGroupDelete
