import DeleteItem from '@/utils/forms/delete'
import { useApolloClient } from '@apollo/client'
import {
  BillDeleteByIdDocument,
  BillsDocument,
  ProductsDocument,
} from '@/gql/graphql'

const BillDelete = (props: any) => {
  const client = useApolloClient()

  const onComplete = () => {
    client.refetchQueries({
      include: [ProductsDocument],
    })
  }

  return (
    <DeleteItem
      mutation={BillDeleteByIdDocument}
      query={BillsDocument}
      listVar="bills"
      onComplete={onComplete}
      classic={false}
      updateCache={false}
      {...props}
    />
  )
}

export default BillDelete
