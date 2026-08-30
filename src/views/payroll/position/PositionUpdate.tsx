import UpdateItem from '@/utils/forms/edit'
import PositionForm from './PositionForm'
import { PositionUpdateDocument } from '@/gql/graphql'

const PositionUpdate = (props: any) => (
  <UpdateItem
    mutation={PositionUpdateDocument}
    form={<PositionForm {...props} />}
  />
)

export default PositionUpdate
