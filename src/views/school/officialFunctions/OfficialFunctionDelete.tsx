import {
  OfficialTypeDeleteDocument,
  OfficialTypesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const OfficialFunctionDelete = (props: any) => (
  <DeleteItem
    mutation={OfficialTypeDeleteDocument}
    query={OfficialTypesDocument}
    listVar="officialTypes"
    {...props}
  />
)

export default OfficialFunctionDelete
