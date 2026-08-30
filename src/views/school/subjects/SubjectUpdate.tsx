import SubjectForm from '@/views/school/subjects/SubjectForm'
import UpdateItem from '@/utils/forms/edit'
import { SubjectSaveDocument, SubjectsDocument } from '@/gql/graphql'

const SubjectUpdate = (props: any) => (
  <UpdateItem
    mutation={SubjectSaveDocument}
    query={SubjectsDocument}
    form={<SubjectForm {...props} />}
    listVar="subjects"
    singleVar="subject"
  />
)

export default SubjectUpdate
