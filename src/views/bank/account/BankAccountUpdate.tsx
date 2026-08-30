import UpdateItem from '@/utils/forms/edit'
import { BankAccountUpdateDocument } from '@/gql/graphql'
import BankAccountForm from './BankAccountForm'

const BankAccountUpdate = (props: any) => (
  <UpdateItem
    mutation={BankAccountUpdateDocument}
    form={<BankAccountForm {...props} />}
  />
)

export default BankAccountUpdate
