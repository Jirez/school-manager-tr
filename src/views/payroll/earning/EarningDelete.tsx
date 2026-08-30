import { EarningDeleteDocument, EarningsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const EarningDelete = (props: any) => (
  <DeleteItem
    mutation={EarningDeleteDocument}
    query={EarningsDocument}
    listVar="earnings"
    singleVar="earning"
    {...props}
  />
)

export default EarningDelete
