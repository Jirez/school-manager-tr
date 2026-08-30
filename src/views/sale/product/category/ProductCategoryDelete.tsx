import {
  ProductCategoriesDocument,
  ProductCategoryDeleteDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const ProductCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={ProductCategoryDeleteDocument}
    query={ProductCategoriesDocument}
    listVar="productCategories"
    {...props}
  />
)

export default ProductCategoryDelete
