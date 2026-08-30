import AddItem from '@/utils/forms/create'
import { SupplierCategorySaveDocument } from '@/gql/graphql'
import SupplierCategoryForm from './SupplierCategoryForm'

const SupplierCategoryAdd = (props: any) => (
  <AddItem
    mutation={SupplierCategorySaveDocument}
    form={<SupplierCategoryForm {...props} />}
  />
)

export default SupplierCategoryAdd
