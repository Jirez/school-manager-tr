import { ClassDeleteDocument, ClassesDocument } from '@/gql/graphql'
import DeleteItem from '@/utils/forms/delete'

const ClassDelete = (props: any) => (
  <DeleteItem
    mutation={ClassDeleteDocument}
    query={ClassesDocument}
    listVar="clazzes"
    singleVar="clazz"
    {...props}
  />
)

export default ClassDelete
