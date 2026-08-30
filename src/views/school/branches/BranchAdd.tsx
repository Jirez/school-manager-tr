import BranchForm from '@/views/school/branches/BranchForm'
import AddItem from '@/utils/forms/create'
import { BranchSaveDocument } from '@/gql/graphql'

const BranchAdd = (props: any) => (
  <AddItem mutation={BranchSaveDocument} form={<BranchForm {...props} />} />
)

export default BranchAdd
