import { EarningSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import EarningForm from './EarningForm'

const EarningAdd = (props: any) => (
  <AddItem mutation={EarningSaveDocument} form={<EarningForm {...props} />} />
)

export default EarningAdd
