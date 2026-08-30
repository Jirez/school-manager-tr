import AddItem from '@/utils/forms/create'
import { CompetenceSaveDocument } from '@/gql/graphql'
import CompetenceForm from './CompetenceForm'

const CompetenceAdd = (props: any) => (
  <AddItem
    mutation={CompetenceSaveDocument}
    form={<CompetenceForm {...props} />}
  />
)

export default CompetenceAdd
