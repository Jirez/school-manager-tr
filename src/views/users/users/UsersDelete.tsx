import { UserDeleteManyDocument, UsersDocument } from '@/gql/graphql'
import DeleteAllItem from '@/utils/forms/deleteAll'

const UsersDelete = (props: any) => (
  <DeleteAllItem
    mutation={UserDeleteManyDocument}
    query={UsersDocument}
    listVar="users"
    {...props}
  />
)

export default UsersDelete
