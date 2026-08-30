import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import { ArticleUpdateDocument, useArticleUnionByIdQuery } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import ArticleForm from './ArticleForm'

const ArticleUpdate = (props: any) => {
  //console.log(props.product)
  const { data, error, loading } = useArticleUnionByIdQuery({
    variables: { id: props.product.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const article = data?.article

  return (
    <UpdateItem
      mutation={ArticleUpdateDocument}
      form={<ArticleForm {...props} product={article} />}
    />
  )
}

export default ArticleUpdate
