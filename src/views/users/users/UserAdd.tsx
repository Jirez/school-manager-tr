import UserForm from '@/views/users/users/UserForm'
import AddItem from '@/utils/forms/create'
import { UserSaveDocument } from '@/gql/graphql'

const UserAdd = (props: any) => (
  <AddItem mutation={UserSaveDocument} form={<UserForm {...props} />} />
)

export default UserAdd
