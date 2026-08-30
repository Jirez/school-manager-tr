import AddItem from '@/utils/forms/create'
import InvoicePaymentForm from './InvoicePaymentForm'
import { StudentPaymentSaveDocument } from '@/gql/graphql'

const InvoicePaymentAdd = (props: any) => (
  <AddItem
    mutation={StudentPaymentSaveDocument}
    form={<InvoicePaymentForm {...props} />}
  />
)

export default InvoicePaymentAdd
