import AddItem from '@/utils/forms/create'
import TeacherForm from './TeacherForm'
import { TeacherSaveDocument } from '@/gql/graphql'

const TeacherAdd = (props: any) => (
  <AddItem mutation={TeacherSaveDocument} form={<TeacherForm {...props} />} />
)

export default TeacherAdd
