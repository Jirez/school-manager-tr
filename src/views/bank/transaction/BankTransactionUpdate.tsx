import UpdateItem from '@/utils/forms/edit'
import { BankTransactionUpdateDocument } from '@/gql/graphql'
import BankTransactionForm from './BankTransactionForm'

const BankTransactionUpdate = (props: any) => (
  <UpdateItem
    mutation={BankTransactionUpdateDocument}
    form={<BankTransactionForm {...props} />}
  />
)

export default BankTransactionUpdate
