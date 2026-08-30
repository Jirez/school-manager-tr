import UpdateItem from '@/utils/forms/edit'
import { CustomerUpdateDocument } from '@/gql/graphql'
import CustomerForm from './CustomerForm'

const CustomerUpdate = (props: any) => (
  <UpdateItem
    mutation={CustomerUpdateDocument}
    form={<CustomerForm {...props} />}
  />
)

export default CustomerUpdate
