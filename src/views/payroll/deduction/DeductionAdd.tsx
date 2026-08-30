import { DeductionSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import DeductionForm from './DeductionForm'

const DeductionAdd = (props: any) => (
  <AddItem
    mutation={DeductionSaveDocument}
    form={<DeductionForm {...props} />}
  />
)

export default DeductionAdd
