import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'

import { formatError } from '@/utils/ErrorHelper'
import { SubjectsNotInGroupDocument } from '@/gql/graphql'

export const useSubjectNotInGroup = (branchId: number | null) => {
  const [subjects, setSubjects] = useState([])
  const client = useApolloClient()

  const findSubjects = async (branchId: number) => {
    const { data } = await client.query({
      query: SubjectsNotInGroupDocument,
      variables: { id: Number(branchId) },
      fetchPolicy: 'no-cache',
    })

    if (data && data.subjects) {
      setSubjects(data.subjects)
    }
  }

  useEffect(() => {
    if (branchId) {
      findSubjects(branchId).catch((error) => {
        setSubjects([])
        toast.error(formatError(error))
      })
    }
  }, [branchId])

  return subjects
}
