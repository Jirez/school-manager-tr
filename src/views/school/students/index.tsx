import { useModal } from '@ebay/nice-modal-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import StudentModal from '@/views/school/students/StudentModal'
import { useUnregisteredStudentsQuery } from '@/gql/graphql'
import { useTranslation } from 'react-i18next'
import { useTitle, useMount } from 'ahooks'
import { useTableColumns } from './studentModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useState } from 'react'

const Students = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(StudentModal)
  const { t } = useTranslation()
  const [isMount, setMount] = useState(false)

  useTitle(t('sidebar.students'))

  const { data, error, loading, subscribeToMore, refetch } =
    useUnregisteredStudentsQuery({
      variables: { id: enterpriseId },
      fetchPolicy: 'no-cache',
      pollInterval: 0,
    })

  const { columns } = useTableColumns(modal, refetch)

  const { table, globalFilter, setGlobalFilter, totalCount, setRowSelection } =
    useTable<any>({
      data: data?.students || [],
      columns,
    })

  useMount(() => {
    setMount(true)
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <div className="flex flex-col w-full">
      <Navs links={StudentsLinks} />
      <Toolbar
        title={t('label-unregisteredStudents')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_student"
        onClick={() => modal.show({ refetch })}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="!text-sm">
        {isMount && (
          <CustomTable table={table} modal={modal} loading={loading} />
        )}
      </div>
    </div>
  )
}

export default Students
