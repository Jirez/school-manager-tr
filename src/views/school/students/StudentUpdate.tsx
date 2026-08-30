import StudentForm from '@/views/school/students/StudentForm'
import UpdateItem from '@/utils/forms/edit'
import { StudentUpdateDocument } from '@/gql/graphql'

const StudentUpdate = (props: any) => (
  <UpdateItem
    mutation={StudentUpdateDocument}
    form={<StudentForm {...props} />}
  />
)

export default StudentUpdate
