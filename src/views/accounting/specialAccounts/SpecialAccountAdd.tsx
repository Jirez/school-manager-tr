import AddItem from '@/utils/forms/create'
import SpecialAccountForm from './SpecialAccountForm'
import { SpecialAccountSaveDocument } from '@/gql/graphql'

const SpecialAccountAdd = (props: any) => (
  <AddItem
    mutation={SpecialAccountSaveDocument}
    form={<SpecialAccountForm {...props} />}
  />
)

export default SpecialAccountAdd
