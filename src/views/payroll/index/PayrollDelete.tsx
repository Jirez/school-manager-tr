import { PayrollDeleteDocument, PayrollsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PayrollDelete = (props: any) => (
  <DeleteItem
    mutation={PayrollDeleteDocument}
    query={PayrollsDocument}
    listVar="payrolls"
    singleVar="payroll"
    {...props}
    classic={false}
  />
)

export default PayrollDelete
