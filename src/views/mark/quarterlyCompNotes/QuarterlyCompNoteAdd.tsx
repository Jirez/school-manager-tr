import AddItem from '@/utils/forms/create'
import { QuarterlyCompNoteSaveDocument } from '@/gql/graphql'
import QuarterlyCompNoteForm from './QuarterlyCompNoteForm'

const QuarterlyCompNoteAdd = (props: any) => (
  <AddItem
    mutation={QuarterlyCompNoteSaveDocument}
    form={<QuarterlyCompNoteForm {...props} />}
  />
)

export default QuarterlyCompNoteAdd
