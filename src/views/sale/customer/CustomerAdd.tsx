import { CustomerSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import CustomerForm from './CustomerForm'

const CustomerAdd = (props: any) => (
  <AddItem mutation={CustomerSaveDocument} form={<CustomerForm {...props} />} />
)

export default CustomerAdd
