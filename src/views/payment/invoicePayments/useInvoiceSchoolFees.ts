import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import type { SchoolFeeLevelItem } from '@/views/payment/schoolFeeLevels/SchoolFeeLevel.type'
import { StudentInvoiceItemByReferenceDocument } from '@/gql/graphql'

export const useInvoiceSchoolFee = (
  reference?: string | null,
  schoolId?: number,
) => {
  const [schoolFeeLevels, setSchoolFeeLevels] = useState<SchoolFeeLevelItem[]>(
    [],
  )
  const client = useApolloClient()

  const findUnpaid = async (reference: string, schoolId: number) => {
    const { data } = await client.query({
      query: StudentInvoiceItemByReferenceDocument,
      variables: { reference, schoolId: Number(schoolId) },
      fetchPolicy: 'no-cache',
    })

    if (data && data.studentInvoiceItemByReference) {
      setSchoolFeeLevels(data.studentInvoiceItemByReference)
    }
  }

  useEffect(() => {
    if (reference && schoolId) {
      findUnpaid(reference, schoolId).catch((error) => {
        setSchoolFeeLevels([])
        //console.log(error.message);
        toast.error(error.message)
      })
    }
  }, [reference, schoolId])

  return { schoolFeeLevels }
}
