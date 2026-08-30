import { EvalTypeDeleteByIdDocument, EvalTypesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const EvalTypeDelete = (props: any) => (
  <DeleteItem
    mutation={EvalTypeDeleteByIdDocument}
    query={EvalTypesDocument}
    listVar="evalTypes"
    {...props}
  />
)

export default EvalTypeDelete
