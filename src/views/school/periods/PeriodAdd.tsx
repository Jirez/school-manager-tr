import PeriodForm from '@/views/school/periods/PeriodForm'
import AddItem from '@/utils/forms/create'
import { PeriodSaveDocument } from '@/gql/graphql'

const PeriodAdd = (props: any) => (
  <AddItem mutation={PeriodSaveDocument} form={<PeriodForm {...props} />} />
)

export default PeriodAdd
