import { useApolloClient } from '@apollo/client'
import { InitLevelsDocument } from '@/gql/graphql'
import { useEffect, useState } from 'react'

export const useLevels = (schoolId: number | null) => {
  const [levels, setLevels] = useState<any[]>([])
  const client = useApolloClient()

  const findLevels = async (schoolId: number) => {
    const { data } = await client.query({
      query: InitLevelsDocument,
      variables: { schoolId },
      fetchPolicy: 'network-only',
    })

    if (data && data.levels) {
      setLevels(data.levels)
    }
  }

  useEffect(() => {
    if (schoolId) {
      findLevels(schoolId)
    }
  }, [schoolId])

  return { levels }
}
