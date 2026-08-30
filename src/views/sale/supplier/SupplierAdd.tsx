import { SupplierSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import SupplierForm from './SupplierForm'

const SupplierAdd = (props: any) => (
  <AddItem mutation={SupplierSaveDocument} form={<SupplierForm {...props} />} />
)

export default SupplierAdd
