import { DayOfClassDeleteDocument, DayOfClassesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const DayOfClassDelete = (props: any) => (
  <DeleteItem
    mutation={DayOfClassDeleteDocument}
    query={DayOfClassesDocument}
    listVar="dayOfClasses"
    classic={false}
    {...props}
  />
)

export default DayOfClassDelete
