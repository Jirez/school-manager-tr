import { EarningCategoryUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import EarningCategoryForm from './EarningCategoryForm'

const EarningCategoryUpdate = (props: any) => (
  <UpdateItem
    mutation={EarningCategoryUpdateDocument}
    form={<EarningCategoryForm {...props} />}
  />
)

export default EarningCategoryUpdate
