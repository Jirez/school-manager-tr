import AddItem from '@/utils/forms/create'
import { EvalTypeSaveDocument } from '@/gql/graphql'
import EvalTypeForm from './EvalTypeForm'

const EvalTypeAdd = (props: any) => (
  <AddItem mutation={EvalTypeSaveDocument} form={<EvalTypeForm {...props} />} />
)

export default EvalTypeAdd
