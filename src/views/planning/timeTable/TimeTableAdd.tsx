import AddItem from '@/utils/forms/create'
import { TimeTableSaveDocument } from '@/gql/graphql'
import TimeTableForm from './TimeTableForm'

const TimeTableAdd = (props: any) => (
  <AddItem
    mutation={TimeTableSaveDocument}
    form={<TimeTableForm {...props} />}
  />
)

export default TimeTableAdd
