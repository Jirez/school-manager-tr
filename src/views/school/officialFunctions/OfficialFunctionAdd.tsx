import OfficialFunctionForm from '@/views/school/officialFunctions/OfficialFunctionForm'
import AddItem from '@/utils/forms/create'
import { OfficialTypeSaveDocument } from '@/gql/graphql'

const OfficialFunctionAdd = (props: any) => (
  <AddItem
    mutation={OfficialTypeSaveDocument}
    form={<OfficialFunctionForm {...props} />}
  />
)

export default OfficialFunctionAdd
