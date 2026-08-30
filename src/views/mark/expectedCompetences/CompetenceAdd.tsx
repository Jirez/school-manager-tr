import CompetenceForm from '@/views/mark/expectedCompetences/CompetenceForm'
import AddItem from '@/utils/forms/create'
import { ExpectedCompetencesSaveDocument } from '@/gql/graphql'

const CompetenceAdd = (props: any) => (
  <AddItem
    mutation={ExpectedCompetencesSaveDocument}
    form={<CompetenceForm {...props} />}
  />
)

export default CompetenceAdd
