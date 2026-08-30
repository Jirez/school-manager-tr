import {
  CompetenceDeleteByIdDocument,
  CompetencesDocument,
} from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const CompetenceDelete = (props: any) => (
  <DeleteItem
    mutation={CompetenceDeleteByIdDocument}
    query={CompetencesDocument}
    listVar="competences"
    {...props}
  />
)

export default CompetenceDelete
