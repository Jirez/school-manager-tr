import {
  BranchSubjectGroupDeleteDocument,
  SubjectGroupByBranchDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SubjectGroupDelete = (props: any) => (
  <DeleteItem
    mutation={BranchSubjectGroupDeleteDocument}
    query={SubjectGroupByBranchDocument}
    listVar="subjectGroups"
    {...props}
  />
)

export default SubjectGroupDelete
