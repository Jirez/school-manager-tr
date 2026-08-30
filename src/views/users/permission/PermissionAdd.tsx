import AddItem from '@/utils/forms/create'
import PermissionForm from '@/views/users/permission/PermissionForm'
import { PermissionSaveDocument } from '@/gql/graphql'

const PermissionAdd = (props: any) => (
  <AddItem
    mutation={PermissionSaveDocument}
    form={<PermissionForm {...props} />}
  />
)

export default PermissionAdd
