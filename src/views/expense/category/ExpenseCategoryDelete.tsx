import {
  ExpenseCategoryDeleteDocument,
  ExpenseCategoriesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const ExpenseCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={ExpenseCategoryDeleteDocument}
    query={ExpenseCategoriesDocument}
    listVar="expenseCategories"
    {...props}
  />
)

export default ExpenseCategoryDelete
