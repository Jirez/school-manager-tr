import AddItem from '@/utils/forms/create'
import { PSequentialNoteSaveDocument } from '@/gql/graphql'
import PSequentialNoteForm from './PSequentialNoteForm'

const PSequentialNoteAdd = (props: any) => (
  <AddItem
    mutation={PSequentialNoteSaveDocument}
    form={<PSequentialNoteForm {...props} />}
  />
)

export default PSequentialNoteAdd
