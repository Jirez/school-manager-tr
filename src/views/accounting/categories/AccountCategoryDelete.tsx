import {
  AccountCategoriesDocument,
  AccountCategoryDeleteDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const AccountCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={AccountCategoryDeleteDocument}
    query={AccountCategoriesDocument}
    listVar="accountCategories"
    {...props}
  />
)

export default AccountCategoryDelete
