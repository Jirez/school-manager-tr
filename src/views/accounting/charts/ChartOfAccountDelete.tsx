import {
  ChartOfAccountDeleteDocument,
  ChartOfAccountsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const ChartOfAccountDelete = (props: any) => (
  <DeleteItem
    mutation={ChartOfAccountDeleteDocument}
    query={ChartOfAccountsDocument}
    listVar="chartOfAccounts"
    {...props}
  />
)

export default ChartOfAccountDelete
