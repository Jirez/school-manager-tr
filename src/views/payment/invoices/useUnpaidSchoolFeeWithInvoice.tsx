import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import type { SchoolFeeLevelItem } from '@/views/payment/schoolFeeLevels/SchoolFeeLevel.type'
import { formatError } from '@/utils/ErrorHelper'
import { UnpaidSchoolFeeWithInvoiceDocument } from '@/gql/graphql'

export const useUnpaidSchoolFeeWithInvoice = (
  studentId?: number | null,
  schoolId?: number,
) => {
  const [schoolFeeLevels, setSchoolFeeLevels] = useState<SchoolFeeLevelItem[]>(
    [],
  )
  const client = useApolloClient()

  const findUnpaid = async (studentId: number, schoolId: number) => {
    const { data } = await client.query({
      query: UnpaidSchoolFeeWithInvoiceDocument,
      variables: { studentId: Number(studentId), schoolId: Number(schoolId) },
      fetchPolicy: 'no-cache',
    })

    if (data && data.schoolFeeLevels) {
      setSchoolFeeLevels(data.schoolFeeLevels)
    }
  }

  useEffect(() => {
    if (studentId && schoolId) {
      findUnpaid(studentId, schoolId).catch((error) => {
        setSchoolFeeLevels([])
        toast.error(formatError(error))
      })
    }
  }, [studentId, schoolId])

  return { schoolFeeLevels }
}
