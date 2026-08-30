import { CycleDeleteDocument, CyclesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const CycleDelete = (props: any) => (
  <DeleteItem
    mutation={CycleDeleteDocument}
    query={CyclesDocument}
    listVar="cycles"
    singleVar="cycle"
    {...props}
  />
)

export default CycleDelete
