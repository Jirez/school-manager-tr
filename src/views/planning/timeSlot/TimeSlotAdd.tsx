import { TimeSlotSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import TimeSlotForm from './TimeSlotForm'

const TimeSlotAdd = (props: any) => (
  <AddItem mutation={TimeSlotSaveDocument} form={<TimeSlotForm {...props} />} />
)

export default TimeSlotAdd
