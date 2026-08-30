import DeleteItem from '@/utils/forms/delete'
import { PermissionDeleteDocument, PermissionsDocument } from '@/gql/graphql'

const PermissionDelete = (props: any) => (
  <DeleteItem
    mutation={PermissionDeleteDocument}
    query={PermissionsDocument}
    listVar="permissions"
    {...props}
  />
)

export default PermissionDelete
