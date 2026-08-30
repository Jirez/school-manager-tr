import { CashVoucherUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import CashVoucherForm from './CashVoucherForm'

const CashVoucherUpdate = (props: any) => (
  <UpdateItem
    mutation={CashVoucherUpdateDocument}
    form={<CashVoucherForm {...props} />}
  />
)

export default CashVoucherUpdate
