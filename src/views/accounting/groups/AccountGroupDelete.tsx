import {
  AccountGroupDeleteDocument,
  AccountGroupsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const AccountGroupDelete = (props: any) => (
  <DeleteItem
    mutation={AccountGroupDeleteDocument}
    query={AccountGroupsDocument}
    listVar="accountGroups"
    {...props}
  />
)

export default AccountGroupDelete
