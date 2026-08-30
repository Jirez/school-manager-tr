import {
  EarningCategoryDeleteDocument,
  EarningCategoryDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const EarningCategoryDelete = (props: any) => (
  <DeleteItem
    mutation={EarningCategoryDeleteDocument}
    query={EarningCategoryDocument}
    listVar="earningCategories"
    singleVar="earningCategory"
    {...props}
  />
)

export default EarningCategoryDelete
