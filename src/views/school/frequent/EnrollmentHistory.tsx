import GraphQLError from '@/@core/components/errors/graphql-error'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useEnrollmentsOfStudentQuery } from '@/gql/graphql'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  id?: string
  onGlobalFilterChanged: any
}

interface EnrollmentHistoryType {
  schoolYearId: number
  schoolYearLabel: string
  classId: number
  className: string
}

const EnrollmentHistory: React.FC<Props> = ({ id, ...props }) => {
  const { t } = useTranslation()
  const { data, error, loading } = useEnrollmentsOfStudentQuery({
    variables: { studentId: id },
    fetchPolicy: 'network-only',
    skip: !id,
  })

  const columns = useMemo<ColumnDef<EnrollmentHistoryType>[]>(
    () => [
      {
        header: `${t('label-schoolYear')}`,
        accessorKey: 'schoolYearLabel',
      },
      {
        header: `${t('label-class')}`,
        accessorKey: 'className',
      },
    ],
    [t],
  )

  if (error) {
    return <GraphQLError error={error} />
  }

  return (
    <div>
      <CommonTable
        data={data ? (data.enrollments as any[]) : []}
        columns={columns}
        // onModelUpdate={rows => showDisplayedRowCount(rows)}
        showQuickFilter={false}
        showCheckbox={false}
        loading={loading}
        onGlobalFilterChanged={props.onGlobalFilterChanged}
        // modal={props.modal}
      />
    </div>
  )
}

export default EnrollmentHistory
