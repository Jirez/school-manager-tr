import { ProductCategoryUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import ProductCategoryForm from './ProductCategoryForm'

const ProductCategoryUpdate = (props: any) => (
  <UpdateItem
    mutation={ProductCategoryUpdateDocument}
    form={<ProductCategoryForm {...props} />}
  />
)

export default ProductCategoryUpdate
