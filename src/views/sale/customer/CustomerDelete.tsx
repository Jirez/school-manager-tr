import { CustomerDeleteDocument, CustomersDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const CustomerDelete = (props: any) => (
  <DeleteItem
    mutation={CustomerDeleteDocument}
    query={CustomersDocument}
    listVar="customers"
    classic={false}
    updateCache={true}
    filterKey="id"
    {...props}
  />
)

export default CustomerDelete
