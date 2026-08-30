import AddItem from '@/utils/forms/create'
import ChartOfAccountForm from './ChartOfAccountForm'
import { ChartOfAccountSaveDocument } from '@/gql/graphql'

const ChartOfAccountAdd = (props: any) => (
  <AddItem
    mutation={ChartOfAccountSaveDocument}
    form={<ChartOfAccountForm {...props} />}
  />
)

export default ChartOfAccountAdd
