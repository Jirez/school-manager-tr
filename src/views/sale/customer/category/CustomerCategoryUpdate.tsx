import { CustomerCategoryUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import CustomerCategoryForm from './CustomerCategoryForm'

const CustomerCategoryUpdate = (props: any) => (
  <UpdateItem
    mutation={CustomerCategoryUpdateDocument}
    form={<CustomerCategoryForm {...props} />}
  />
)

export default CustomerCategoryUpdate
