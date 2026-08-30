import AddItem from '@/utils/forms/create'
import SubjectGroupForm from './SubjectGroupForm'
import { BranchSubjectGroupSaveDocument } from '@/gql/graphql'

const SubjectGroupAdd = (props: any) => (
  <AddItem
    mutation={BranchSubjectGroupSaveDocument}
    form={<SubjectGroupForm {...props} />}
  />
)

export default SubjectGroupAdd
