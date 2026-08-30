import AddItem from '@/utils/forms/create'
import { EvalCompSaveDocument } from '@/gql/graphql'
import EvalCompSubjectForm from './EvalCompSubjectForm'

const EvalCompSubjectAdd = (props: any) => (
  <AddItem
    mutation={EvalCompSaveDocument}
    form={<EvalCompSubjectForm {...props} />}
  />
)

export default EvalCompSubjectAdd
