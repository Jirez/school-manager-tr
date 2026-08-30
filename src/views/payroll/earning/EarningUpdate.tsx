import { EarningUpdateDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import EarningForm from './EarningForm'

const EarningUpdate = (props: any) => (
  <UpdateItem
    mutation={EarningUpdateDocument}
    form={<EarningForm {...props} />}
  />
)

export default EarningUpdate
