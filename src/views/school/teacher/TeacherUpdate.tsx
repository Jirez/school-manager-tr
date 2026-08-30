import UpdateItem from '@/utils/forms/edit'
import TeacherForm from './TeacherForm'
import { TeacherUpdateDocument } from '@/gql/graphql'

const TeacherUpdate = (props: any) => (
  <UpdateItem
    mutation={TeacherUpdateDocument}
    form={<TeacherForm {...props} />}
  />
)

export default TeacherUpdate
