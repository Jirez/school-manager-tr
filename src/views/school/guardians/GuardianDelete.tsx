import { GuardianDeleteDocument, GuardiansDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const GuardianDelete = (props: any) => (
  <DeleteItem
    mutation={GuardianDeleteDocument}
    query={GuardiansDocument}
    listVar="guardians"
    {...props}
  />
)

export default GuardianDelete
