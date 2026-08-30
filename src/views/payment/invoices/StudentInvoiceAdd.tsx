import AddItem from '@/utils/forms/create'
import StudentInvoiceForm from './StudentInvoiceForm'
import { StudentInvoiceSaveDocument } from '@/gql/graphql'

const StudentInvoiceAdd = (props: any) => (
  <AddItem
    mutation={StudentInvoiceSaveDocument}
    form={<StudentInvoiceForm {...props} />}
  />
)

export default StudentInvoiceAdd
