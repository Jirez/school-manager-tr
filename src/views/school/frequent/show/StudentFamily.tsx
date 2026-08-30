import GraphQLError from '@/@core/components/errors/graphql-error'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { useGuardiansOfStudentQuery } from '@/gql/graphql'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  id?: string
  onGlobalFilterChanged: any
}

interface StudentFamilyType {
  relation: string
  guardian: any
}

const StudentFamily: React.FC<Props> = ({ id, ...props }) => {
  const { t } = useTranslation()
  const { data, error, loading } = useGuardiansOfStudentQuery({
    variables: { studentId: id },
    fetchPolicy: 'network-only',
    skip: !id,
  })

  const columns = useMemo<ColumnDef<StudentFamilyType>[]>(
    () => [
      {
        header: `${t('label-name')}`,
        accessorFn: (row) =>
          `${row.guardian.lastName} ${row.guardian.firstName}`,
      },
      {
        header: `${t('label-relation')}`,
        accessorFn: (row) => t(row.relation),
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
        data={data ? (data.guardians as any[]) : []}
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

export default StudentFamily
