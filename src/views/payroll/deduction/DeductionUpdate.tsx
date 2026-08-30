import { DeductionUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import DeductionForm from './DeductionForm'

const DeductionUpdate = (props: any) => (
  <UpdateItem
    mutation={DeductionUpdateDocument}
    form={<DeductionForm {...props} />}
  />
)

export default DeductionUpdate
