import {
  SupplierCategoryDeleteDocument,
  SupplierCategoriesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SupplierCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={SupplierCategoryDeleteDocument}
    query={SupplierCategoriesDocument}
    listVar="supplierCategories"
    {...props}
  />
)

export default SupplierCategoryDelete
