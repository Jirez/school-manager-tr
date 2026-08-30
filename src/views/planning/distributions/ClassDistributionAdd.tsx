import ClassDistributionForm from '@/views/planning/distributions/ClassDistributionForm'
import AddItem from '@/utils/forms/create'
import { ClassDistributionSaveDocument } from '@/gql/graphql'

const ClassDistributionAdd = (props: any) => (
  <AddItem
    mutation={ClassDistributionSaveDocument}
    form={<ClassDistributionForm {...props} />}
  />
)

export default ClassDistributionAdd
