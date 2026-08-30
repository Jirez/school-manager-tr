import AddItem from '@/utils/forms/create'
import GuardianForm from './GuardianForm'
import { GuardianSaveDocument } from '@/gql/graphql'

const GuardianAdd = (props: any) => (
  <AddItem mutation={GuardianSaveDocument} form={<GuardianForm {...props} />} />
)

export default GuardianAdd
