import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'

// import { getStudentGuardianByStudent } from "@queries/students";
import { formatError } from '@/utils/ErrorHelper'
import type { StudentGuardian } from './Student.type'
import { StudentGuardiansDocument } from '@/gql/graphql'

export const useStudentGuardian = (studentId: number | null) => {
  const client = useApolloClient()
  const [studentGuardians, setGuardians] = useState<StudentGuardian[]>([])

  const findStudentGuardians = async (studentId: number) => {
    const { data } = await client.query({
      query: StudentGuardiansDocument,
      variables: { id: studentId },
      fetchPolicy: 'network-only',
    })

    if (data) {
      /* data.studentGuardians.map(({relation, guardian}: any) => {
                switch (relation) {
                    case 'FATHER':
                        setFather(guardian);
                        break;
                    case 'MOTHER':
                        setMother(guardian);
                        break;
                    case 'TUTOR':
                        setTutor(guardian);
                        break;
                }
            }) */
      setGuardians(data.studentGuardians)
    }
  }

  useEffect(() => {
    if (studentId) {
      findStudentGuardians(studentId).catch((error) => {
        // setStudent(null);
        toast.error(formatError(error))
      })
    }
  }, [studentId])

  return { studentGuardians }
}
