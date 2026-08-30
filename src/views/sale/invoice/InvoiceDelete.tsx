import DeleteItem from '@/utils/forms/delete'
import { useApolloClient } from '@apollo/client'
import {
  InvoiceDeleteDocument,
  InvoicesDocument,
  ProductsDocument,
} from '@/gql/graphql'

const InvoiceDelete = (props: any) => {
  const client = useApolloClient()

  const onComplete = () => {
    client.refetchQueries({
      include: [ProductsDocument],
    })
  }

  return (
    <DeleteItem
      mutation={InvoiceDeleteDocument}
      query={InvoicesDocument}
      listVar="invoices"
      onComplete={onComplete}
      classic={false}
      updateCache={false}
      {...props}
    />
  )
}

export default InvoiceDelete
