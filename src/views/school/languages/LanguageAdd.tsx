import LanguageForm from '@/views/school/languages/LanguageForm'
import AddItem from '@/utils/forms/create'
import { LanguageSaveDocument } from '@/gql/graphql'

const LanguageAdd = (props: any) => (
  <AddItem mutation={LanguageSaveDocument} form={<LanguageForm {...props} />} />
)

export default LanguageAdd
