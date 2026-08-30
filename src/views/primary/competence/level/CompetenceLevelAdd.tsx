import AddItem from '@/utils/forms/create'
import { CompetenceLevelSaveDocument } from '@/gql/graphql'
import CompetenceLevelForm from './CompetenceLevelForm'

const CompetenceLevelAdd = (props: any) => (
  <AddItem
    mutation={CompetenceLevelSaveDocument}
    form={<CompetenceLevelForm {...props} />}
  />
)

export default CompetenceLevelAdd
