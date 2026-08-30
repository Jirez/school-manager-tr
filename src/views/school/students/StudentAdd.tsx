import StudentForm from '@/views/school/students/StudentForm'
import AddItem from '@/utils/forms/create'
import { StudentSaveDocument } from '@/gql/graphql'

const StudentAdd = (props: any) => (
  <AddItem mutation={StudentSaveDocument} form={<StudentForm {...props} />} />
)

export default StudentAdd
