import { useApolloClient } from '@apollo/client'
import { InitCyclesDocument } from '@/gql/graphql'
import { useEffect, useState } from 'react'

export const useCycles = (schoolId: number | null) => {
  const [cycles, setCycles] = useState<any[]>([])
  const client = useApolloClient()

  const findCycles = async (schoolId: number) => {
    const { data } = await client.query({
      query: InitCyclesDocument,
      variables: { schoolId },
      fetchPolicy: 'network-only',
    })

    if (data && data.cycles) {
      setCycles(data.cycles)
    }
  }

  useEffect(() => {
    if (schoolId) {
      findCycles(schoolId)
    }
  }, [schoolId])

  return { cycles }
}
