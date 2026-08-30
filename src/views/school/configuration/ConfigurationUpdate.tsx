import { ConfigurationDocument, ConfigurationSaveDocument } from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'

const ConfigurationUpdate = (props: any) => (
  <UpdateItem
    mutation={ConfigurationSaveDocument}
    query={ConfigurationDocument}
    form={props.form}
    listVar="configs"
    singleVar="config"
  />
)

export default ConfigurationUpdate
