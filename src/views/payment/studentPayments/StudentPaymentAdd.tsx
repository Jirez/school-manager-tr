import StudentPaymentForm from '@/views/payment/studentPayments/StudentPaymentForm'
import AddItem from '@/utils/forms/create'
import { StudentPaymentSaveDocument } from '@/gql/graphql'

const StudentPaymentAdd = (props: any) => (
  <AddItem
    mutation={StudentPaymentSaveDocument}
    form={<StudentPaymentForm {...props} />}
  />
)

export default StudentPaymentAdd
