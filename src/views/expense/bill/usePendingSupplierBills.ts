import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import { BillUnpaidBySupplierDocument } from '@/gql/graphql'

export const usePendingSupplierBills = (supplierId?: number | null) => {
  const [bills, setBills] = useState<any[]>([])
  const client = useApolloClient()

  const findUnpaid = async (supplierId: number) => {
    const { data } = await client.query({
      query: BillUnpaidBySupplierDocument,
      variables: { supplierId },
      fetchPolicy: 'no-cache',
    })

    if (data && data.bills) {
      setBills(data.bills)
    }
  }

  useEffect(() => {
    if (supplierId) {
      findUnpaid(supplierId).catch((error) => {
        setBills([])
        toast.error(formatError(error))
      })
    } else {
      setBills([])
    }
  }, [supplierId])

  return { bills }
}
