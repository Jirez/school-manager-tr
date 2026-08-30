import DeleteItem from '@/utils/forms/delete'
import { ProductsDocument, ServiceDeleteDocument } from '@/gql/graphql'

const ServiceDelete = (props: any) => (
  <DeleteItem
    mutation={ServiceDeleteDocument}
    query={ProductsDocument}
    listVar="products"
    classic={false}
    {...props}
  />
)

export default ServiceDelete
