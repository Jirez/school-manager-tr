import { DeductionCategoryUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import DeductionCategoryForm from './DeductionCategoryForm'

const DeductionCategoryUpdate = (props: any) => (
  <UpdateItem
    mutation={DeductionCategoryUpdateDocument}
    form={<DeductionCategoryForm {...props} />}
  />
)

export default DeductionCategoryUpdate
