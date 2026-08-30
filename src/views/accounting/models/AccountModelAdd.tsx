import AccountModelForm from '@/views/accounting/models/AccountModelForm'
import AddItem from '@/utils/forms/create'
import { AccountModelSaveDocument } from '@/gql/graphql'

const AccountModelAdd = (props: any) => (
  <AddItem
    mutation={AccountModelSaveDocument}
    form={<AccountModelForm {...props} />}
  />
)

export default AccountModelAdd
