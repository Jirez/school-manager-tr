import { PeriodDeleteDocument, PeriodsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PeriodDelete = (props: any) => (
  <DeleteItem
    mutation={PeriodDeleteDocument}
    query={PeriodsDocument}
    listVar="periods"
    {...props}
  />
)

export default PeriodDelete
