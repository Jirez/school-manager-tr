import ClassForm from '@/views/school/classes/ClassForm'
import AddItem from '@/utils/forms/create'
import { ClassSaveDocument } from '@/gql/graphql'

const ClassAdd = (props: any) => (
  <AddItem mutation={ClassSaveDocument} form={<ClassForm {...props} />} />
)

export default ClassAdd
