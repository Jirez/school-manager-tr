import PositionForm from '@/views/payroll/position/PositionForm'
import AddItem from '@/utils/forms/create'
import { PositionSaveDocument } from '@/gql/graphql'

const PositionAdd = (props: any) => (
  <AddItem mutation={PositionSaveDocument} form={<PositionForm {...props} />} />
)

export default PositionAdd
