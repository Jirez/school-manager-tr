import AddItem from '@/utils/forms/create'
import ServiceForm from './ServiceForm'
import { ServiceSaveDocument } from '@/gql/graphql'

const ServiceAdd = (props: any) => (
  <AddItem mutation={ServiceSaveDocument} form={<ServiceForm {...props} />} />
)

export default ServiceAdd
