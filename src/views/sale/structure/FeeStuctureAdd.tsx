import AddItem from '@/utils/forms/create'
import { FeeStructureSaveDocument } from '@/gql/graphql'
import FeeStructureForm from './FeeStructureForm'

const FeeStructureAdd = (props: any) => (
  <AddItem
    mutation={FeeStructureSaveDocument}
    form={<FeeStructureForm {...props} />}
  />
)

export default FeeStructureAdd
