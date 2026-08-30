import AddItem from '@/utils/forms/create'
import { BankAccountCreateDocument } from '@/gql/graphql'
import BankAccountForm from './BankAccountForm'

const BankAccountAdd = (props: any) => (
  <AddItem
    mutation={BankAccountCreateDocument}
    form={<BankAccountForm {...props} />}
  />
)

export default BankAccountAdd
