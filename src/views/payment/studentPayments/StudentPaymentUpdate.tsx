import {
  StudentPaymentUpdateDocument,
  useStudentPaymentForUpdateQuery,
} from '@/gql/graphql'
import StudentPaymentUpdateForm from './StudentPaymentUpdateForm'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import UpdateItem from '@/utils/forms/edit'

const StudentPaymentUpdate = (props: any) => {
  const { data, error, loading } = useStudentPaymentForUpdateQuery({
    variables: { paymentId: props.studentPayment.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const payment = data?.studentPayment

  return (
    <UpdateItem
      mutation={StudentPaymentUpdateDocument}
      form={<StudentPaymentUpdateForm {...props} studentPayment={payment} />}
    />
  )
}

export default StudentPaymentUpdate
