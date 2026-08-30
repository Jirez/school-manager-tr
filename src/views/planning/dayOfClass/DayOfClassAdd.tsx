import { DayOfClassSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import DayOfClassForm from './DayOfClassForm'

const DayOfClassAdd = (props: any) => (
  <AddItem
    mutation={DayOfClassSaveDocument}
    form={<DayOfClassForm {...props} />}
  />
)

export default DayOfClassAdd
