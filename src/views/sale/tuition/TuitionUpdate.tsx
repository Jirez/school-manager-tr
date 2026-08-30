import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import { TuitionUpdateDocument, useTuitionUnionByIdQuery } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import TuitionForm from './TuitionForm'

const ArticleUpdate = (props: any) => {
  //console.log(props.product)
  const { data, error, loading } = useTuitionUnionByIdQuery({
    variables: { id: props.product.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const tuition = data?.tuition

  return (
    <UpdateItem
      mutation={TuitionUpdateDocument}
      form={<TuitionForm {...props} product={tuition} />}
    />
  )
}

export default ArticleUpdate
