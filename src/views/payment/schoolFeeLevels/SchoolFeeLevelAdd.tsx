import AddItem from '@/utils/forms/create'
import { SchoolFeeLevelSimpleSaveDocument } from '@/gql/graphql'
import SimpleSchoolFeeLevelForm from './SimpleSchoolFeeLevelForm'

const SchoolFeeLevelAdd = (props: any) => (
  <AddItem
    mutation={SchoolFeeLevelSimpleSaveDocument}
    form={<SimpleSchoolFeeLevelForm {...props} />}
  />
)

export default SchoolFeeLevelAdd
