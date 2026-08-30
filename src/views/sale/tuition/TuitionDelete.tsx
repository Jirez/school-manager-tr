import { ProductsDocument, TuitionDeleteDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const TuitionDelete = (props: any) => (
  <DeleteItem
    mutation={TuitionDeleteDocument}
    query={ProductsDocument}
    listVar="products"
    classic={false}
    {...props}
  />
)

export default TuitionDelete
