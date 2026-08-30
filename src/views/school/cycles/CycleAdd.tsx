import CycleForm from '@/views/school/cycles/CycleForm'
import AddItem from '@/utils/forms/create'
import { CycleSaveDocument } from '@/gql/graphql'

const CycleAdd = (props: any) => (
  <AddItem mutation={CycleSaveDocument} form={<CycleForm {...props} />} />
)

export default CycleAdd
