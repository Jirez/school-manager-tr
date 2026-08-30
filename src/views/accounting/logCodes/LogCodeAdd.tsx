import LogCodeForm from '@/views/accounting/logCodes/LogCodeForm'
import AddItem from '@/utils/forms/create'
import { LogCodeSaveDocument } from '@/gql/graphql'

const LogCodeAdd = (props: any) => (
  <AddItem mutation={LogCodeSaveDocument} form={<LogCodeForm {...props} />} />
)

export default LogCodeAdd
