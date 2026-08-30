import UpdateItem from '@/utils/forms/edit'
import ServiceForm from './ServiceForm'
import { ServiceUpdateDocument, useServiceUnionByIdQuery } from '@/gql/graphql'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'

const ServiceUpdate = (props: any) => {
  //console.log(props.product)
  const { data, error, loading } = useServiceUnionByIdQuery({
    variables: { id: props.product.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const service = data?.service

  return (
    <UpdateItem
      mutation={ServiceUpdateDocument}
      form={<ServiceForm {...props} product={service} />}
    />
  )
}

export default ServiceUpdate
