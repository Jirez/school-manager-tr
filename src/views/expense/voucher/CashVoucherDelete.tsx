import { CashVoucherDeleteDocument, CashVouchersDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const CashVoucherDelete = (props: any) => (
  <DeleteItem
    mutation={CashVoucherDeleteDocument}
    query={CashVouchersDocument}
    listVar="cashVouchers"
    classic={false}
    {...props}
  />
)

export default CashVoucherDelete
