import { useAbility } from '@/context/Can'
import {
  StudentPaymentDeleteDocument,
  StudentPaymentsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const StudentPaymentDelete = (props: any) => {
  const ability = useAbility()

  if (ability.can('delete', 'payment'))
    return (
      <DeleteItem
        mutation={StudentPaymentDeleteDocument}
        query={StudentPaymentsDocument}
        listVar="studentPayments"
        {...props}
      />
    )

  return <span />
}

export default StudentPaymentDelete
