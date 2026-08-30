import FeeGroupForm from '@/views/sale/group/FeeGroupForm'
import AddItem from '@/utils/forms/create'
import { FeeGroupSaveDocument } from '@/gql/graphql'

const FeeGroupAdd = (props: any) => (
  <AddItem mutation={FeeGroupSaveDocument} form={<FeeGroupForm {...props} />} />
)

export default FeeGroupAdd
