import { EarningCategorySaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import EarningCategoryForm from './EarningCategoryForm'

const EarningCategoryAdd = (props: any) => (
  <AddItem
    mutation={EarningCategorySaveDocument}
    form={<EarningCategoryForm {...props} />}
  />
)

export default EarningCategoryAdd
