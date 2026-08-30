import SchoolOfficialForm from '@/views/school/schoolOfficials/SchoolOfficialForm'
import AddItem from '@/utils/forms/create'
import { SchoolOfficialSaveDocument } from '@/gql/graphql'

const SchoolOfficialAdd = (props: any) => (
  <AddItem
    mutation={SchoolOfficialSaveDocument}
    form={<SchoolOfficialForm {...props} />}
  />
)

export default SchoolOfficialAdd
