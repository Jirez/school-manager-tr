import { DiscountDeleteDocument, DiscountsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const DiscountDelete = (props: any) => (
  <DeleteItem
    mutation={DiscountDeleteDocument}
    query={DiscountsDocument}
    listVar="discounts"
    {...props}
  />
)

export default DiscountDelete
