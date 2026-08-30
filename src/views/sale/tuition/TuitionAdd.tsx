import { TuitionSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'
import TuitionForm from './TuitionForm'

const TuitionAdd = (props: any) => (
  <AddItem mutation={TuitionSaveDocument} form={<TuitionForm {...props} />} />
)

export default TuitionAdd
