import { DiscountSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import DiscountForm from './DiscountForm'

const DiscountAdd = (props: any) => (
  <AddItem mutation={DiscountSaveDocument} form={<DiscountForm {...props} />} />
)

export default DiscountAdd
