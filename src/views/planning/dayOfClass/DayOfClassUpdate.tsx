import { DayOfClassUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import DayOfClassForm from './DayOfClassForm'

const DayOfClassUpdate = (props: any) => (
  <UpdateItem
    mutation={DayOfClassUpdateDocument}
    form={<DayOfClassForm {...props} />}
  />
)

export default DayOfClassUpdate
