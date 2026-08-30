import { LevelDeleteDocument, LevelsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const LevelDelete = (props: any) => (
  <DeleteItem
    mutation={LevelDeleteDocument}
    query={LevelsDocument}
    listVar="levels"
    singleVar="levels"
    {...props}
  />
)

export default LevelDelete
