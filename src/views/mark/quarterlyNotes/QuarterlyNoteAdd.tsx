import AddItem from '@/utils/forms/create'
import QuarterlyNoteForm from './QuarterlyNoteForm'
import { QuarterlyNoteSaveDocument } from '@/gql/graphql'

const QuarterlyNoteAdd = (props: any) => (
  <AddItem
    mutation={QuarterlyNoteSaveDocument}
    form={<QuarterlyNoteForm {...props} />}
  />
)

export default QuarterlyNoteAdd
