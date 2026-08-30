import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import type { DocumentNode } from 'graphql'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'

export const useOperationItems = function (
  query: DocumentNode,
  key: string,
  operationId: number | null,
) {
  const [operationItems, setOperationItems] = useState([])
  const client = useApolloClient()

  const findOperationItems = async (operationId: number) => {
    const { data } = await client.query({
      query: query,
      variables: { id: Number(operationId) },
      fetchPolicy: 'no-cache',
    })

    if (data && data[key]) {
      setOperationItems(data[key])
    }
  }

  useEffect(() => {
    if (operationId) {
      findOperationItems(operationId).catch((error) => {
        setOperationItems([])
        toast.error(formatError(error))
      })
    }
  }, [operationId, query, key])

  return { operationItems }
}
