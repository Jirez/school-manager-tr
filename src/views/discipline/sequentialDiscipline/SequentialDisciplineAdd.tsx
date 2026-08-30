import SequentialDisciplineForm from '@/views/discipline/sequentialDiscipline/SequentialDisciplineForm'
import AddItem from '@/utils/forms/create'
import { SequentialDisciplineSaveDocument } from '@/gql/graphql'

const SequentialDisciplineAdd = (props: any) => (
  <AddItem
    mutation={SequentialDisciplineSaveDocument}
    form={<SequentialDisciplineForm {...props} />}
  />
)

export default SequentialDisciplineAdd
