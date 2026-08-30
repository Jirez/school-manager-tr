import DeleteItem from '@/utils/forms/delete'
import { RoleNewDeleteDocument, RolesDocument } from '@/gql/graphql'

const RoleDelete = (props: any) => (
  <DeleteItem
    mutation={RoleNewDeleteDocument}
    query={RolesDocument}
    listVar="roles"
    {...props}
  />
)

export default RoleDelete
