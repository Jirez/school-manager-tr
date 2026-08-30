import { useAbility } from '@/context/Can'
import {
  StudentPaymentsDeleteDocument,
  StudentPaymentsDocument,
} from '@/gql/graphql'
import DeleteAllItem from '@/utils/forms/deleteAll'

const StudentPaymentsDelete = (props: any) => {
  const ability = useAbility()

  if (ability.can('delete', 'payment'))
    return (
      <DeleteAllItem
        mutation={StudentPaymentsDeleteDocument}
        query={StudentPaymentsDocument}
        listVar="studentPayments"
        {...props}
      />
    )

  return <span />
}

export default StudentPaymentsDelete
