import UpdateItem from '@/utils/forms/edit'
import SubjectGroupForm from './SubjectGroupForm'
import { BranchSubjectGroupUpdateDocument } from '@/gql/graphql'

const SubjectGroupUpdate = (props: any) => (
  <UpdateItem
    mutation={BranchSubjectGroupUpdateDocument}
    form={<SubjectGroupForm {...props} />}
  />
)

export default SubjectGroupUpdate
