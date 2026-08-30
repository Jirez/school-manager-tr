import SubPeriodForm from '@/views/school/subPeriods/SubPeriodForm'
import AddItem from '@/utils/forms/create'
import { SubPeriodSaveDocument } from '@/gql/graphql'

const SubPeriodAdd = (props: any) => (
  <AddItem
    mutation={SubPeriodSaveDocument}
    form={<SubPeriodForm {...props} />}
  />
)

export default SubPeriodAdd
