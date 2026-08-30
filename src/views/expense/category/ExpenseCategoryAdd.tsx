import { ExpenseCategorySaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import ExpenseCategoryForm from './ExpenseCategoryForm'

const ExpenseCategoryAdd = (props: any) => (
  <AddItem
    mutation={ExpenseCategorySaveDocument}
    form={<ExpenseCategoryForm {...props} />}
  />
)

export default ExpenseCategoryAdd
