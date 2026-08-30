import { SubPeriodDeleteDocument, SubPeriodsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SubPeriodDelete = (props: any) => (
  <DeleteItem
    mutation={SubPeriodDeleteDocument}
    query={SubPeriodsDocument}
    listVar="subPeriods"
    {...props}
  />
)

export default SubPeriodDelete
