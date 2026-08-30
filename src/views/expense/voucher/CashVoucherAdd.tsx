import { CashVoucherSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import CashVoucherForm from './CashVoucherForm'

const CashVoucherAdd = (props: any) => (
  <AddItem
    mutation={CashVoucherSaveDocument}
    form={<CashVoucherForm {...props} />}
  />
)

export default CashVoucherAdd
