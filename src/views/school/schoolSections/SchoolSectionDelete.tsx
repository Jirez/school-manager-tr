import {
  SchoolSectionDeleteDocument,
  SchoolSectionsDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const SchoolSectionDelete = (props: any) => (
  <DeleteItem
    mutation={SchoolSectionDeleteDocument}
    query={SchoolSectionsDocument}
    listVar="schoolSections"
    singleVar="schoolSection"
    {...props}
  />
)

export default SchoolSectionDelete
