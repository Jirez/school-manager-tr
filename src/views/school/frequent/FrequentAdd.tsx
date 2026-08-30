import AddItem from '@/utils/forms/create'
import FrequentForm from './FrequentForm'
import { FrequentSaveDocument } from '@/gql/graphql'

const FrequentAdd = (props: any) => {
  return (
    <AddItem
      mutation={FrequentSaveDocument}
      form={<FrequentForm {...props} />}
    />
  )
}

export default FrequentAdd
