import { ExpenseCategoryUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import ExpenseCategoryForm from './ExpenseCategoryForm'

const ExpenseCategoryUpdate = (props: any) => (
  <UpdateItem
    mutation={ExpenseCategoryUpdateDocument}
    form={<ExpenseCategoryForm {...props} />}
  />
)

export default ExpenseCategoryUpdate
