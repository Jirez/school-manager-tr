import { ProductsDocument, ArticleDeleteDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const ArticleDelete = (props: any) => (
  <DeleteItem
    mutation={ArticleDeleteDocument}
    query={ProductsDocument}
    listVar="products"
    classic={false}
    {...props}
  />
)

export default ArticleDelete
