import PermissionForm from '@/views/users/permission/PermissionForm'
import UpdateItem from '@/utils/forms/edit'
import { PermissionUpdateDocument } from '@/gql/graphql'

const PermissionUpdate = (props: any) => (
  <UpdateItem
    mutation={PermissionUpdateDocument}
    form={<PermissionForm {...props} />}
  />
)

export default PermissionUpdate
