import { DiscountUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import DiscountForm from './DiscountForm'

const DiscountUpdate = (props: any) => (
  <UpdateItem
    mutation={DiscountUpdateDocument}
    form={<DiscountForm {...props} />}
  />
)

export default DiscountUpdate
