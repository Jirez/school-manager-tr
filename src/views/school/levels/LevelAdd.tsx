import LevelForm from '@/views/school/levels/LevelForm'
import AddItem from '@/utils/forms/create'
import { LevelSaveDocument } from '@/gql/graphql'

const LevelAdd = (props: any) => (
  <AddItem mutation={LevelSaveDocument} form={<LevelForm {...props} />} />
)

export default LevelAdd
