import InstallmentForm from '@/views/sale/installment/InstallmentForm'
import AddItem from '@/utils/forms/create'
import { InstallmentSaveDocument } from '@/gql/graphql'

const InstallmentAdd = (props: any) => (
  <AddItem
    mutation={InstallmentSaveDocument}
    form={<InstallmentForm {...props} />}
  />
)

export default InstallmentAdd
