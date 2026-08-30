import {
  PayrollPeriodDeleteDocument,
  PayrollPeriodsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const PayrollPeriodDelete = (props: any) => (
  <DeleteItem
    mutation={PayrollPeriodDeleteDocument}
    query={PayrollPeriodsDocument}
    listVar="payrollPeriods"
    singleVar="payrollPeriod"
    {...props}
  />
)

export default PayrollPeriodDelete
