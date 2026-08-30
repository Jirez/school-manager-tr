import SchoolFeeForm from '@/views/payment/schoolFees/SchoolFeeForm'
import AddItem from '@/utils/forms/create'
import { SchoolFeeSaveDocument } from '@/gql/graphql'

const SchoolFeeAdd = (props: any) => (
  <AddItem
    mutation={SchoolFeeSaveDocument}
    form={<SchoolFeeForm {...props} />}
  />
)

export default SchoolFeeAdd
