import AddItem from '@/utils/forms/create'
import AnnualResultForm from './AnnualResultForm'
import { AnnualResultSaveDocument } from '@/gql/graphql'

const AnnualResultAdd = (props: any) => (
  <AddItem
    mutation={AnnualResultSaveDocument}
    form={<AnnualResultForm {...props} />}
  />
)

export default AnnualResultAdd
