import SchoolSectionForm from '@/views/school/schoolSections/SchoolSectionForm'
import AddItem from '@/utils/forms/create'
import { SchoolSectionSaveDocument } from '@/gql/graphql'

const SchoolSectionAdd = (props: any) => (
  <AddItem
    mutation={SchoolSectionSaveDocument}
    form={<SchoolSectionForm {...props} />}
  />
)

export default SchoolSectionAdd
