import { BillSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import BillForm from './BillForm'

const BillAdd = (props: any) => (
  <AddItem mutation={BillSaveDocument} form={<BillForm {...props} />} />
)

export default BillAdd
