import { InvoiceSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import InvoiceForm from './InvoiceForm'

const InvoiceAdd = (props: any) => (
  <AddItem mutation={InvoiceSaveDocument} form={<InvoiceForm {...props} />} />
)

export default InvoiceAdd
