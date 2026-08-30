import { useAbility } from '@/context/Can'
import {
  StudentInvoiceDeleteDocument,
  StudentInvoicesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const StudentInvoiceDelete = (props: any) => {
  const ability = useAbility()

  if (ability.can('delete', 'invoice'))
    return (
      <DeleteItem
        mutation={StudentInvoiceDeleteDocument}
        query={StudentInvoicesDocument}
        listVar="studentInvoices"
        {...props}
      />
    )

  return <span />
}

export default StudentInvoiceDelete
