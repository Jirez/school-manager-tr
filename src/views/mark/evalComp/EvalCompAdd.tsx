import AddItem from '@/utils/forms/create'
import { EvalCompSaveDocument } from '@/gql/graphql'
import EvalCompForm from './EvalCompForm'

const EvalCompAdd = (props: any) => (
  <AddItem mutation={EvalCompSaveDocument} form={<EvalCompForm {...props} />} />
)

export default EvalCompAdd
