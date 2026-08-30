import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { formatError } from '@/utils/ErrorHelper'
import { toast } from 'react-toastify'
import type { StudentType } from './Student.type'
import { StudentsByIdDocument } from '@/gql/graphql'

export const useStudent = (studentId: number | null) => {
  const [student, setStudent] = useState<
    { [key: string]: any } | null | StudentType
  >()
  const client = useApolloClient()

  const findStudent = async (studentId: number) => {
    const { data } = await client.query({
      query: StudentsByIdDocument,
      variables: { id: studentId },
      fetchPolicy: 'network-only',
    })

    if (data && data.student) {
      setStudent(data.student)
    }
  }

  useEffect(() => {
    if (studentId) {
      findStudent(studentId).catch((error) => {
        setStudent(null)
        toast.error(formatError(error))
      })
    }
  }, [studentId])

  return { student }
}
