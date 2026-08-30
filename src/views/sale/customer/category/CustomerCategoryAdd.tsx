import { CustomerCategorySaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import CustomerCategoryForm from './CustomerCategoryForm'

const CustomerCategoryAdd = (props: any) => (
  <AddItem
    mutation={CustomerCategorySaveDocument}
    form={<CustomerCategoryForm {...props} />}
  />
)

export default CustomerCategoryAdd
