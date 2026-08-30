import { PositionDeleteDocument, PositionsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PositionDelete = (props: any) => (
  <DeleteItem
    mutation={PositionDeleteDocument}
    query={PositionsDocument}
    listVar="positions"
    singleVar="position"
    {...props}
  />
)

export default PositionDelete
