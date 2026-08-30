import {
  OperationClassDeleteDocument,
  OperationClassesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const OperationClassDelete = (props: any) => (
  <DeleteItem
    mutation={OperationClassDeleteDocument}
    query={OperationClassesDocument}
    listVar="operationClasses"
    {...props}
  />
)

export default OperationClassDelete
