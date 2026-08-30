import AccountGroupForm from '@/views/accounting/groups/AccountGroupForm'
import AddItem from '@/utils/forms/create'
import { AccountGroupSaveDocument } from '@/gql/graphql'

const AccountGroupAdd = (props: any) => (
  <AddItem
    mutation={AccountGroupSaveDocument}
    form={<AccountGroupForm {...props} />}
  />
)

export default AccountGroupAdd
