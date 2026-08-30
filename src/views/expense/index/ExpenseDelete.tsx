import DeleteItem from '@/utils/forms/delete'
import { ExpenseDeleteByIdDocument, ExpensesDocument } from '@/gql/graphql'

const ExpenseDelete = (props: any) => (
  <DeleteItem
    mutation={ExpenseDeleteByIdDocument}
    query={ExpensesDocument}
    listVar="expenses"
    {...props}
  />
)

export default ExpenseDelete
