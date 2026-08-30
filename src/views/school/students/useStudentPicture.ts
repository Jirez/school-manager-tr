import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'

import { useAuthentication } from '@/hooks/useAuthentication'
// import { getStudentPictureByStudent } from "@queries/students";
import { StudentPictureByStudentDocument } from '@/gql/graphql'

export const useStudentPicture = (studentId: number | null) => {
  const [picture, setPicture] = useState<string | null>(null)
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()

  const findStudentPicture = async (studentId: number) => {
    const { data } = await client.query({
      query: StudentPictureByStudentDocument,
      variables: { studentId: studentId, schoolId: enterpriseId },
      fetchPolicy: 'network-only',
    })

    if (data && data.studentPicture) {
      setPicture(data.studentPicture.image)
    }
  }

  useEffect(() => {
    if (studentId) {
      findStudentPicture(studentId)
    }
  }, [studentId])

  return { picture }
}
