import AddItem from '@/utils/forms/create'
import OldSchoolForm from './OldSchoolForm'
import { OldSchoolSaveDocument } from '@/gql/graphql'

const OldSchoolAdd = (props: any) => (
  <AddItem
    mutation={OldSchoolSaveDocument}
    form={<OldSchoolForm {...props} />}
  />
)

export default OldSchoolAdd
