import AddItem from '@/utils/forms/create'
import AccountForm from './AccountForm'
import { AccountSaveDocument } from '@/gql/graphql'

const AccountAdd = (props: any) => (
  <AddItem mutation={AccountSaveDocument} form={<AccountForm {...props} />} />
)

export default AccountAdd
