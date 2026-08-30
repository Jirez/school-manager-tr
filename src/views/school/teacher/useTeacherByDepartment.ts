import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import { TeacherByDepartmentDocument } from '@/gql/graphql'

export const useTeacherByDepartment = (
  departmentId: number | null | undefined,
) => {
  const [teachers, setTeachers] = useState<{ [key: string]: any } | null>(null)
  const client = useApolloClient()

  const findTeachers = async (departmentId: number) => {
    const { data } = await client.query({
      query: TeacherByDepartmentDocument,
      variables: { id: Number(departmentId) },
      fetchPolicy: 'network-only',
    })

    if (data && data.teachers) {
      setTeachers(data.teachers)
    }
  }

  useEffect(() => {
    if (departmentId) {
      findTeachers(departmentId)
    }
  }, [departmentId, findTeachers])

  return { teachers }
}
