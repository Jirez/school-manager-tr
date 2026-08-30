import {
  CustomerCategoriesDocument,
  CustomerCategoryDeleteDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const CustomerCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={CustomerCategoryDeleteDocument}
    query={CustomerCategoriesDocument}
    listVar="customerCategories"
    {...props}
  />
)

export default CustomerCategoryDelete
