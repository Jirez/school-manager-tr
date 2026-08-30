import HeadDepartmentForm from './HeadDepartmentForm'
import AddItem from '@/utils/forms/create'
import { HeadDepartmentsSaveDocument } from '@/gql/graphql'

const HeadDepartmentAdd = (props: any) => (
  <AddItem
    mutation={HeadDepartmentsSaveDocument}
    form={<HeadDepartmentForm {...props} />}
  />
)

export default HeadDepartmentAdd
