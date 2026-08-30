import { UserDeleteDocument, UsersDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const UserDelete = (props: any) => (
  <DeleteItem
    mutation={UserDeleteDocument}
    query={UsersDocument}
    listVar="users"
    singleVar="user"
    {...props}
  />
)

export default UserDelete
