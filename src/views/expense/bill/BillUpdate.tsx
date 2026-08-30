import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import UpdateItem from '@/utils/forms/edit'
import InvoiceForm from './BillForm'
import {
  BillUpdateDocument,
  useBillByIdQuery,
  useBillItemsQuery,
} from '@/gql/graphql'

const BillUpdate = (props: any) => {
  const { data, error, loading } = useBillByIdQuery({
    variables: { id: props.bill.operationId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataI,
    error: errorI,
    loading: loadingI,
  } = useBillItemsQuery({
    variables: { id: props.bill.operationId },
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

  const invoice = data?.bill
  const items = dataI?.items

  return (
    <UpdateItem
      mutation={BillUpdateDocument}
      form={<InvoiceForm {...props} bill={{ ...invoice, items }} />}
    />
  )
}

export default BillUpdate
