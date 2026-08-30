import AccountCategoryForm from '@/views/accounting/categories/AccountCategoryForm'
import AddItem from '@/utils/forms/create'
import { AccountCategorySaveDocument } from '@/gql/graphql'

const AccountCategoryAdd = (props: any) => (
  <AddItem
    mutation={AccountCategorySaveDocument}
    form={<AccountCategoryForm {...props} />}
  />
)

export default AccountCategoryAdd
