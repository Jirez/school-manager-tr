import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { StudentsByClassDocument } from '@/gql/graphql'

export const useStudentByClass = (classId: number | null) => {
  const [students, setStudents] = useState<{ [key: string]: any } | null>(null)
  const client = useApolloClient()

  const findStudents = async (classId: number) => {
    const { data } = await client.query({
      query: StudentsByClassDocument,
      variables: { id: Number(classId) },
      fetchPolicy: 'network-only',
    })

    if (data && data.students) {
      setStudents(data.students)
    }
  }

  useEffect(() => {
    if (classId) {
      findStudents(classId)
    }
  }, [classId])

  return { students }
}
