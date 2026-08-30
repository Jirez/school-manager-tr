import SequentialNoteForm from '@/views/mark/sequentialNotes/SequentialNoteForm'
import AddItem from '@/utils/forms/create'
import { SequentialNotesSaveDocument } from '@/gql/graphql'

const SequentialNoteAdd = (props: any) => (
  <AddItem
    mutation={SequentialNotesSaveDocument}
    form={<SequentialNoteForm {...props} />}
  />
)

export default SequentialNoteAdd
