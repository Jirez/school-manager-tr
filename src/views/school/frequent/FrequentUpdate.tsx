import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import UpdateItem from '@/utils/forms/edit'
import FrequentUpdateForm from './FrequentUpdateForm'
import { FrequentUpdateDocument, useFrequentByIdQuery } from '@/gql/graphql'

const FrequentUpdate = (props: any) => {
  // console.log(props)
  const { data, error, loading } = useFrequentByIdQuery({
    variables: {
      id: {
        studentId: Number(props.frequent.frequentPK.studentId),
        classId: Number(props.frequent.frequentPK.classId),
        schoolYearId: Number(props.frequent.frequentPK.schoolYearId),
      },
    },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  const { frequent } = data!

  return (
    <UpdateItem
      mutation={FrequentUpdateDocument}
      form={<FrequentUpdateForm {...props} frequent={frequent} />}
    />
  )
}

export default FrequentUpdate
