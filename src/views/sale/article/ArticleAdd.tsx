import { ArticleSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import ArticleForm from './ArticleForm'

const ArticleAdd = (props: any) => (
  <AddItem mutation={ArticleSaveDocument} form={<ArticleForm {...props} />} />
)

export default ArticleAdd
