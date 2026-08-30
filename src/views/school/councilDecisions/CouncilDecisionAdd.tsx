import AddItem from '@/utils/forms/create'
import CouncilDecisionForm from './CouncilDecisionForm'
import { CouncilDecisionSaveDocument } from '@/gql/graphql'

const CouncilDecisionAdd = (props: any) => (
  <AddItem
    mutation={CouncilDecisionSaveDocument}
    form={<CouncilDecisionForm {...props} />}
  />
)

export default CouncilDecisionAdd
