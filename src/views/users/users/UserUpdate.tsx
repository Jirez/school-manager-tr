import UserForm from '@/views/users/users/UserForm'
import UpdateItem from '@/utils/forms/edit'
import { UserUpdateDocument } from '@/gql/graphql'

const UserUpdate = (props: any) => (
  <UpdateItem mutation={UserUpdateDocument} form={<UserForm {...props} />} />
)

export default UserUpdate
