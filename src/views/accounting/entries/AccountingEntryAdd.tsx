import AddItem from '@/utils/forms/create'
import AccountingEntryForm from './AccountingEntryForm'
import { AccountingEntrySaveDocument } from '@/gql/graphql'

const AccountingEntryAdd = (props: any) => (
  <AddItem
    mutation={AccountingEntrySaveDocument}
    form={<AccountingEntryForm {...props} />}
  />
)

export default AccountingEntryAdd
