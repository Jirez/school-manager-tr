import AddItem from '@/utils/forms/create'
import { CompetenceUpdateDocument } from '@/gql/graphql'
import CompetenceForm from './CompetenceForm'

const CompetenceUpdate = (props: any) => (
  <AddItem
    mutation={CompetenceUpdateDocument}
    form={<CompetenceForm {...props} />}
  />
)

export default CompetenceUpdate
