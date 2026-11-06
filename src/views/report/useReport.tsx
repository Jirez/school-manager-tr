import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { ReportCategoriesByEnterpriseDocument } from '@/gql/graphql'

export const useReport = (enterpriseId: number) => {
  const [items, setItems] = useState<any[] | null>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const client = useApolloClient()

  const findReports = async (_enterpriseId: number) => {
    setLoading(true)
    const { data } = await client.query({
      query: ReportCategoriesByEnterpriseDocument,
      variables: { id: _enterpriseId },
      fetchPolicy: 'no-cache',
    })

    setLoading(false)

    if (data && data.reportCategories) {
      setItems(data.reportCategories)
    }
  }

  useEffect(() => {
    if (enterpriseId) {
      findReports(enterpriseId).catch((e) => {
        setError(e)
        setLoading(false)
      })
    }
  }, [enterpriseId])

  return { items, setItems, loading, error }
}
