import SubjectForm from '@/views/school/subjects/SubjectForm'
import AddItem from '@/utils/forms/create'
import { SubjectSaveDocument } from '@/gql/graphql'

const SubjectAdd = (props: any) => (
  <AddItem mutation={SubjectSaveDocument} form={<SubjectForm {...props} />} />
)

export default SubjectAdd
