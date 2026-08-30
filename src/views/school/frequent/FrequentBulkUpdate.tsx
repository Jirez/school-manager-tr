import AddItem from '@/utils/forms/create'
import { FrequentBulkUpdateDocument } from '@/gql/graphql'
import FrequentBulkUpdateForm from './FrequentBulkUpdateForm'

const FrequentBulkUpdate = (props: any) => {
  return (
    <AddItem
      mutation={FrequentBulkUpdateDocument}
      form={<FrequentBulkUpdateForm {...props} />}
    />
  )
}

export default FrequentBulkUpdate
