import UpdateItem from '@/utils/forms/edit'
import { SupplierUpdateDocument } from '@/gql/graphql'
import SupplierForm from './SupplierForm'

const SupplierUpdate = (props: any) => (
  <UpdateItem
    mutation={SupplierUpdateDocument}
    form={<SupplierForm {...props} />}
  />
)

export default SupplierUpdate
