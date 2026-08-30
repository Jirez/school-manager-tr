import { ProductCategorySaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import ProductCategoryForm from './ProductCategoryForm'

const ProductCategoryAdd = (props: any) => (
  <AddItem
    mutation={ProductCategorySaveDocument}
    form={<ProductCategoryForm {...props} />}
  />
)

export default ProductCategoryAdd
