import AddItem from '@/utils/forms/create'
import {
  BillPaymentSaveDocument,
  useBillByIdQuery,
  useSupplierByBillIdQuery,
} from '@/gql/graphql'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import BillPaymentForm from './BillPaymentForm'

const BillPaymentReceive = (props: any) => {
  const { data, error, loading } = useSupplierByBillIdQuery({
    variables: { billId: props.payment.operationId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataI,
    error: errorI,
    loading: loadingI,
  } = useBillByIdQuery({
    variables: { id: props.payment.operationId },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (errorI) {
    return <GraphQLError error={errorI} />
  }

  if (loading || loadingI) {
    return <Loader />
  }

  const supplier = data?.supplier
  const items = dataI?.bill

  return (
    <AddItem
      mutation={BillPaymentSaveDocument}
      form={
        <BillPaymentForm
          {...props}
          supplier={supplier}
          items={{
            ...items,
            description: `Facture # ${items?.number} (${items?.operationDate})`,
            paidAmount: items?.balance,
            paidAmountF: items?.balance,
          }}
        />
      }
    />
  )
}

export default BillPaymentReceive
