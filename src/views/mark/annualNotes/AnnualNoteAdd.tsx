import AddItem from '@/utils/forms/create'
import AnnualNoteForm from './AnnualNoteForm'
import { AnnualNoteSaveDocument } from '@/gql/graphql'

const QuarterlyNoteAdd = (props: any) => (
  <AddItem
    mutation={AnnualNoteSaveDocument}
    form={<AnnualNoteForm {...props} />}
  />
)

export default QuarterlyNoteAdd
