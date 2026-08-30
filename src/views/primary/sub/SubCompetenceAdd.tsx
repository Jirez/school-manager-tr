import AddItem from '@/utils/forms/create'
import { SubCompetenceSaveDocument } from '@/gql/graphql'
import SubCompetenceForm from './SubCompetenceForm'

const SubCompetenceAdd = (props: any) => (
  <AddItem
    mutation={SubCompetenceSaveDocument}
    form={<SubCompetenceForm {...props} />}
  />
)

export default SubCompetenceAdd
