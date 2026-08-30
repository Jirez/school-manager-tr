import UpdateItem from '@/utils/forms/edit'
import { SupplierCategoryUpdateDocument } from '@/gql/graphql'
import SupplierCategoryForm from './SupplierCategoryForm'

const SupplierCategoryUpdate = (props: any) => (
  <UpdateItem
    mutation={SupplierCategoryUpdateDocument}
    form={<SupplierCategoryForm {...props} />}
  />
)

export default SupplierCategoryUpdate
