import AddItem from '@/utils/forms/create'
import BulkAnnualResultForm from './BulkAnnualResultForm'
import { BulkAnnualResultSaveDocument } from '@/gql/graphql'

const BulkAnnualResultAdd = (props: any) => (
  <AddItem
    mutation={BulkAnnualResultSaveDocument}
    form={<BulkAnnualResultForm {...props} />}
  />
)

export default BulkAnnualResultAdd
