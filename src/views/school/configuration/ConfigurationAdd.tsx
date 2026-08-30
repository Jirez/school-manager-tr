import { ConfigurationSaveDocument } from '@/gql/graphql'
import AddItem from '@/utils/forms/create'

const ConfigurationAdd = (props: any) => (
  <AddItem mutation={ConfigurationSaveDocument} form={props.form} />
)

export default ConfigurationAdd
