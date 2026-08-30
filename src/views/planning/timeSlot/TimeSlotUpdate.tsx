import { TimeSlotUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import TimeSlotForm from './TimeSlotForm'

const TimeSlotUpdate = (props: any) => (
  <UpdateItem
    mutation={TimeSlotUpdateDocument}
    form={<TimeSlotForm {...props} />}
  />
)

export default TimeSlotUpdate
