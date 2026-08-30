import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import UpdateItem from '@/utils/forms/edit'
import InvoiceForm from './InvoiceForm'
import {
  InvoiceUpdateDocument,
  useInvoiceByIdQuery,
  useInvoiceItemsQuery,
} from '@/gql/graphql'

const InvoiceUpdate = (props: any) => {
  const { data, error, loading } = useInvoiceByIdQuery({
    variables: { id: props.invoice.operationId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataI,
    error: errorI,
    loading: loadingI,
  } = useInvoiceItemsQuery({
    variables: { id: props.invoice.operationId },
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

  const invoice = data?.invoice
  const items = dataI?.items

  return (
    <UpdateItem
      mutation={InvoiceUpdateDocument}
      form={<InvoiceForm {...props} invoice={{ ...invoice, items }} />}
    />
  )
}

export default InvoiceUpdate
