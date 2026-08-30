import DeleteItem from '@/utils/forms/delete'
import {
  PaymentDeleteByIdDocument,
  CustomerOperationsDocument,
} from '@/gql/graphql'

const PaymentDelete = (props: any) => {
  return (
    <DeleteItem
      mutation={PaymentDeleteByIdDocument}
      query={CustomerOperationsDocument}
      listVar="customerOperations"
      classic={false}
      updateCache={false}
      {...props}
    />
  )
}

export default PaymentDelete
