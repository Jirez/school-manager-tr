import OperationClassForm from '@/views/core/operationClass/OperationClassForm'
import AddItem from '@/utils/forms/create'
import { OperationClassSaveDocument } from '@/gql/graphql'

const OperationClassAdd = (props: any) => (
  <AddItem
    mutation={OperationClassSaveDocument}
    form={<OperationClassForm {...props} />}
  />
)

export default OperationClassAdd
