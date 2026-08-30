import BranchForm from '@/views/school/branches/BranchForm'
import UpdateItem from '@/utils/forms/edit'
import { BranchUpdateDocument } from '@/gql/graphql'

const BranchUpdate = (props: any) => (
  <UpdateItem
    mutation={BranchUpdateDocument}
    form={<BranchForm {...props} />}
  />
)

export default BranchUpdate
