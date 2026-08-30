import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import type { SchoolFeeLevelItem } from '@/views/payment/schoolFeeLevels/SchoolFeeLevel.type'
// import { formatError } from "@utils/ErrorHelper";
import { UnpaidSchoolFeeDocument } from '@/gql/graphql'

export const useUnpaidSchoolFee = (
  studentId?: number | null,
  schoolId?: number,
) => {
  const [schoolFeeLevels, setSchoolFeeLevels] = useState<SchoolFeeLevelItem[]>(
    [],
  )
  const client = useApolloClient()

  const findUnpaid = async (studentId: number, schoolId: number) => {
    const { data } = await client.query({
      query: UnpaidSchoolFeeDocument,
      variables: { studentId: Number(studentId), schoolId: schoolId },
      fetchPolicy: 'no-cache',
    })

    if (data && data.findUnpaidSchoolFee) {
      setSchoolFeeLevels(data.findUnpaidSchoolFee)
    }
  }

  useEffect(() => {
    if (studentId && schoolId) {
      findUnpaid(studentId, schoolId).catch((error) => {
        toast.error(error.message)
        setSchoolFeeLevels([])
      })
    }
  }, [studentId, schoolId])

  return { schoolFeeLevels }
}
