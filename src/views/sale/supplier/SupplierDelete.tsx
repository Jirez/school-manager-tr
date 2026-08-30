import { SupplierDeleteDocument, SuppliersDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SupplierDelete = (props: any) => (
  <DeleteItem
    mutation={SupplierDeleteDocument}
    query={SuppliersDocument}
    listVar="suppliers"
    classic={false}
    updateCache={true}
    filterKey="id"
    {...props}
  />
)

export default SupplierDelete
