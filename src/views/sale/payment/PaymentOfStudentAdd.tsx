import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import UpdateItem from '@/utils/forms/edit'
import PaymentOfStudentForm from './PaymentOfStudentForm'
import {
  PaymentOfStudentSaveDocument,
  usePaymentOfStudentQuery,
} from '@/gql/graphql'

const PaymentOfStudentAdd = (props: any) => {
  const { data, error, loading } = usePaymentOfStudentQuery({
    variables: { invoiceId: props.invoiceId },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const payment = data?.payment

  return (
    <UpdateItem
      mutation={PaymentOfStudentSaveDocument}
      form={<PaymentOfStudentForm {...props} payment={payment} />}
    />
  )
}

export default PaymentOfStudentAdd
