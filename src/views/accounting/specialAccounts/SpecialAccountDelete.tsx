import {
  SpecialAccountDeleteDocument,
  SpecialAccountsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SpecialAccountDelete = (props: any) => (
  <DeleteItem
    mutation={SpecialAccountDeleteDocument}
    query={SpecialAccountsDocument}
    listVar="specialAccounts"
    singleVar="specialAccount"
    {...props}
  />
)

export default SpecialAccountDelete
