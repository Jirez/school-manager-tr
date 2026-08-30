import { AccountDeleteDocument, AccountsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const AccountDelete = (props: any) => (
  <DeleteItem
    mutation={AccountDeleteDocument}
    query={AccountsDocument}
    listVar="accounts"
    {...props}
  />
)

export default AccountDelete
