import { InstallmentDeleteDocument, InstallmentsDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const InstallmentDelete = (props: any) => (
  <DeleteItem
    mutation={InstallmentDeleteDocument}
    query={InstallmentsDocument}
    listVar="installments"
    {...props}
  />
)

export default InstallmentDelete
