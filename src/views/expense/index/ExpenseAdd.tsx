import AddItem from '@/utils/forms/create'
import ExpenseForm from './ExpenseForm'
import { ExpenseSaveDocument } from '@/gql/graphql'

const ExpenseAdd = (props: any) => (
  <AddItem mutation={ExpenseSaveDocument} form={<ExpenseForm {...props} />} />
)

export default ExpenseAdd
