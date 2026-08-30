import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { ReportCategoriesByEnterpriseDocument } from '@/gql/graphql'

export const useReport = (enterpriseId: number) => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const client = useApolloClient()

  const findReports = async (enterpriseId: number) => {
    setLoading(true)
    const { data } = await client.query({
      query: ReportCategoriesByEnterpriseDocument,
      variables: { id: enterpriseId },
      fetchPolicy: 'no-cache',
    })

    setLoading(false)

    if (data && data.reportCategories) {
      setItems(data.reportCategories)
    }
  }

  useEffect(() => {
    if (enterpriseId) {
      findReports(enterpriseId).catch((error) => {
        setError(error)
        setLoading(false)
      })
    }
  }, [enterpriseId])

  return { items, setItems, loading, error }
}
