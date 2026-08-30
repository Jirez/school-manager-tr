import { LogCodeDeleteDocument, LogCodesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const LogCodeDelete = (props: any) => (
  <DeleteItem
    mutation={LogCodeDeleteDocument}
    query={LogCodesDocument}
    listVar="logCodes"
    {...props}
  />
)

export default LogCodeDelete
