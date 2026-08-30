import { TimeSlotDeleteDocument, TimeSlotsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const TimeSlotDelete = (props: any) => (
  <DeleteItem
    mutation={TimeSlotDeleteDocument}
    query={TimeSlotsDocument}
    listVar="timeSlots"
    singleVar="timeSlot"
    {...props}
  />
)

export default TimeSlotDelete
