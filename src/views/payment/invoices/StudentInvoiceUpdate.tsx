import AddItem from '@/utils/forms/create'
import {
  StudentInvoiceUpdateDocument,
  useStudentInvoiceForUpdateQuery,
} from '@/gql/graphql'
import StudentInvoiceUpdateForm from './StudentInvoiceUpdateForm'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'

const StudentInvoiceUpdate = (props: any) => {
  const { data, error, loading } = useStudentInvoiceForUpdateQuery({
    variables: { id: props.studentInvoice.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const invoice = data?.invoices

  return (
    <AddItem
      mutation={StudentInvoiceUpdateDocument}
      form={<StudentInvoiceUpdateForm {...props} studentInvoice={invoice} />}
    />
  )
}

export default StudentInvoiceUpdate
