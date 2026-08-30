import UpdateItem from '@/utils/forms/edit'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import {
  RoleNewUpdateDocument,
  usePermissionsOfRole2Query,
} from '@/gql/graphql'
import RoleForm from './RoleForm'

const RoleUpdate = (props: any) => {
  const { data, error, loading } = usePermissionsOfRole2Query({
    variables: { id: props.role.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const permissions = data?.permissions

  return (
    <UpdateItem
      mutation={RoleNewUpdateDocument}
      form={<RoleForm {...props} permissions={permissions} />}
    />
  )
}

export default RoleUpdate
