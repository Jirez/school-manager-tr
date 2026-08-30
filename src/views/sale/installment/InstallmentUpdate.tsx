import InstallmentForm from '@/views/sale/installment/InstallmentForm'
import UpdateItem from '@/utils/forms/edit'
import { InstallmentUpdateDocument } from '@/gql/graphql'

const InstallmentUpdate = (props: any) => (
  <UpdateItem
    mutation={InstallmentUpdateDocument}
    form={<InstallmentForm {...props} />}
  />
)

export default InstallmentUpdate
