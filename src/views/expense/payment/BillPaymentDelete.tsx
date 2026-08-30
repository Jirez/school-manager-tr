import DeleteItem from '@/utils/forms/delete'
import {
  VendorOperationsDocument,
  BillPaymentDeleteDocument,
} from '@/gql/graphql'

const BillPaymentDelete = (props: any) => {
  return (
    <DeleteItem
      mutation={BillPaymentDeleteDocument}
      query={VendorOperationsDocument}
      listVar="vendorOperations"
      classic={false}
      updateCache={false}
      {...props}
    />
  )
}

export default BillPaymentDelete
