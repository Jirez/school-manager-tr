import UpdateItem from '@/utils/forms/edit'
import DepartmentForm from './DepartmentForm'
import { DepartmentUpdateDocument } from '@/gql/graphql'

const DepartmentUpdate = (props: any) => (
  <UpdateItem
    mutation={DepartmentUpdateDocument}
    form={<DepartmentForm {...props} />}
  />
)

export default DepartmentUpdate
