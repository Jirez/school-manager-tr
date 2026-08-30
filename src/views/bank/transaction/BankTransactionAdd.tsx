import AddItem from '@/utils/forms/create'
import { BankTransactionCreateDocument } from '@/gql/graphql'
import BankTransactionForm from './BankTransactionForm'

const BankTransactionAdd = (props: any) => (
  <AddItem
    mutation={BankTransactionCreateDocument}
    form={<BankTransactionForm {...props} />}
  />
)

export default BankTransactionAdd
