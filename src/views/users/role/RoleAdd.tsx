import AddItem from '@/utils/forms/create'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import { RoleNewSaveDocument, usePermissionGroups2Query } from '@/gql/graphql'
import RoleForm from './RoleForm'

const RoleAdd = (props: any) => {
  const { data, error, loading } = usePermissionGroups2Query({
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const groups = data?.groups

  return (
    <AddItem
      mutation={RoleNewSaveDocument}
      form={<RoleForm {...props} permissions={groups} />}
    />
  )
}

export default RoleAdd
