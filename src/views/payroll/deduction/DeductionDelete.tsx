import { DeductionDeleteDocument, DeductionsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const DeductionDelete = (props: any) => (
  <DeleteItem
    mutation={DeductionDeleteDocument}
    query={DeductionsDocument}
    listVar="deductions"
    singleVar="deduction"
    {...props}
  />
)

export default DeductionDelete
