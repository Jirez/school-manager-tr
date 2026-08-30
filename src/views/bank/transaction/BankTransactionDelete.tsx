import {
  BankTransactionDeleteDocument,
  BankTransactionsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const BankTransactionDelete = (props: any) => (
  <DeleteItem
    mutation={BankTransactionDeleteDocument}
    query={BankTransactionsDocument}
    listVar="bankTransactions"
    singleVar="bankTransaction"
    {...props}
  />
)

export default BankTransactionDelete
