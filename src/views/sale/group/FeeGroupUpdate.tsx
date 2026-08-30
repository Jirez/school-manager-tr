import FeeGroupForm from '@/views/sale/group/FeeGroupForm'
import UpdateItem from '@/utils/forms/edit'
import { FeeGroupUpdateDocument } from '@/gql/graphql'

const FeeGroupUpdate = (props: any) => (
  <UpdateItem
    mutation={FeeGroupUpdateDocument}
    form={<FeeGroupForm {...props} />}
  />
)

export default FeeGroupUpdate
