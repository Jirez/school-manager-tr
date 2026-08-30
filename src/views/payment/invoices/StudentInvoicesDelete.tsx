import { useAbility } from '@/context/Can'
import {
  StudentInvoicesDeleteDocument,
  StudentInvoicesDocument,
} from '@/gql/graphql'
import DeleteAllItem from '@/utils/forms/deleteAll'

const StudentInvoicesDelete = (props: any) => {
  const ability = useAbility()

  if (ability.can('delete', 'payment'))
    return (
      <DeleteAllItem
        mutation={StudentInvoicesDeleteDocument}
        query={StudentInvoicesDocument}
        listVar="studentInvoices"
        {...props}
      />
    )

  return <span />
}

export default StudentInvoicesDelete
