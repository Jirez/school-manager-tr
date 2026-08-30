import {
  AccountModelDeleteDocument,
  AccountModelsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const AccountModelDelete = (props: any) => (
  <DeleteItem
    mutation={AccountModelDeleteDocument}
    query={AccountModelsDocument}
    listVar="accountModels"
    {...props}
  />
)

export default AccountModelDelete
