import AddItem from '@/utils/forms/create'
import { PFreeSequentialNoteSaveDocument } from '@/gql/graphql'
import PFreeSequentialNoteForm from './PFreeSequentialNoteForm'

const PFreeSequentialNoteAdd = (props: any) => (
  <AddItem
    mutation={PFreeSequentialNoteSaveDocument}
    form={<PFreeSequentialNoteForm {...props} />}
  />
)

export default PFreeSequentialNoteAdd
