import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import { SubjectBranchesDocument } from '@/gql/graphql'

export const useSubjectBranch = (branchId: number | null) => {
  const [subjectBranches, setSubjectBranches] = useState<any[] | null>([])
  const client = useApolloClient()

  const fetch = async function (internalBranchId: number) {
    const { data } = await client.query({
      query: SubjectBranchesDocument,
      variables: { branchId: Number(internalBranchId) },
      fetchPolicy: 'no-cache',
    })

    if (data && data.subjectBranches) {
      setSubjectBranches(data.subjectBranches)
    }
  }

  useEffect(() => {
    if (branchId) {
      fetch(branchId).catch((error) => {
        setSubjectBranches([])
        toast.error(formatError(error))
      })
    }
  }, [branchId])

  return { subjectBranches }
}
