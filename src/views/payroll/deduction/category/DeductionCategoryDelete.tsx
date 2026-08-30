import {
  DeductionCategoryDeleteDocument,
  DeductionCategoryDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const DeductionCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={DeductionCategoryDeleteDocument}
    query={DeductionCategoryDocument}
    listVar="deductionCategories"
    singleVar="deductionCategory"
    {...props}
  />
)

export default DeductionCategoryDelete
