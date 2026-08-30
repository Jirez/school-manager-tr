import UpdateItem from '@/utils/forms/edit'
import GuardianForm from './GuardianForm'
import { GuardianUpdateDocument, useGuardianByIdQuery } from '@/gql/graphql'
import Loader from '@/@core/components/spinner/loader'

const GuardianUpdate = (props: any) => {
  const { data, loading } = useGuardianByIdQuery({
    variables: { id: props.guardian.id },
    fetchPolicy: 'network-only',
  })

  if (loading) {
    return <Loader />
  }

  return (
    <UpdateItem
      mutation={GuardianUpdateDocument}
      form={<GuardianForm {...props} guardian={data?.guardian} />}
    />
  )
}

export default GuardianUpdate
