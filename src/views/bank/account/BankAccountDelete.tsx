import { BankAccountDeleteDocument, BankAccountsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const BankAccountDelete = (props: any) => (
  <DeleteItem
    mutation={BankAccountDeleteDocument}
    query={BankAccountsDocument}
    listVar="bankAccounts"
    singleVar="bankAccount"
    {...props}
  />
)

export default BankAccountDelete
