import {
  LoginHistoriesDocument,
  LoginHistoryDeleteByIdsDocument,
} from '@/gql/graphql'
import DeleteAllItem from '@/utils/forms/deleteAll'

const LoginHistoriesDelete = (props: any) => (
  <DeleteAllItem
    mutation={LoginHistoryDeleteByIdsDocument}
    query={LoginHistoriesDocument}
    listVar="loginHistories"
    {...props}
  />
)

export default LoginHistoriesDelete
