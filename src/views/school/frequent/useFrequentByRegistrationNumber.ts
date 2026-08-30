import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'

import type { TFrequent } from './FrequentTable'
import { FrequentByRegistrationNumberDocument } from '@/gql/graphql'

export const useFrequentByRegistrationNumber = (
  registrationNumber: string | null,
  schoolId: number | null,
) => {
  const [frequent, setFrequent] = useState<TFrequent | null>(null)
  const client = useApolloClient()

  const findFrequent = async (registrationNumber: string, schoolId: number) => {
    const { data } = await client.query({
      query: FrequentByRegistrationNumberDocument,
      variables: { registrationNumber, schoolId },
      fetchPolicy: 'network-only',
    })

    if (data) {
      setFrequent(data.frequent)
    }
  }

  useEffect(() => {
    if (registrationNumber && schoolId) {
      findFrequent(registrationNumber, schoolId)
    }
  }, [registrationNumber, schoolId])

  return { frequent }
}
