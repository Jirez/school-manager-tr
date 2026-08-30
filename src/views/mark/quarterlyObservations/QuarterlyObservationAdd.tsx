import AddItem from '@/utils/forms/create'
import QuarterlyObservationForm from './QuarterlyObservationForm'
import { QuarterlyReportObservationSaveDocument } from '@/gql/graphql'

const QuarterlyObservationAdd = (props: any) => (
  <AddItem
    mutation={QuarterlyReportObservationSaveDocument}
    form={<QuarterlyObservationForm {...props} />}
  />
)

export default QuarterlyObservationAdd
