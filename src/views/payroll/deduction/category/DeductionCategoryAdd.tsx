import { DeductionCategorySaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import DeductionCategoryForm from './DeductionCategoryForm'

const DeductionCategoryAdd = (props: any) => (
  <AddItem
    mutation={DeductionCategorySaveDocument}
    form={<DeductionCategoryForm {...props} />}
  />
)

export default DeductionCategoryAdd
