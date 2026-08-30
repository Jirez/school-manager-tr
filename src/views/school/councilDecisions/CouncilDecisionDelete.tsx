import {
  CouncilDecisionDeleteDocument,
  CouncilDecisionsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const CouncilDecisionDelete = (props: any) => (
  <DeleteItem
    mutation={CouncilDecisionDeleteDocument}
    query={CouncilDecisionsDocument}
    listVar="councilDecisions"
    {...props}
  />
)

export default CouncilDecisionDelete
