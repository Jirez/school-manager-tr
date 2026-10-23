import { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SubjectLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import DepartmentModal from '@/views/school/subjectDepartments/DepartmentModal'
import {
  useSubjectDepartmentCreatedSubscription,
  useSubjectDepartmentsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './departmentModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'

const SubjectDepartments = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(DepartmentModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.subjects.departments'))

  const { data, error, loading, refetch } = useSubjectDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.subjectDepartments || [],
    columns,
  })

  const { data: subscriptionData } = useSubjectDepartmentCreatedSubscription()

  useEffect(() => {
    if (subscriptionData) {
      refetch()
    }
  }, [subscriptionData])

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SubjectLinks} />
      <Toolbar
        title={t('sidebar.subjects.departments')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_subjectDepartment"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
        isRefetching={loading}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable
          error={error}
          table={table as any}
          loading={loading}
          modal={modal}
          onRetry={() => refetch()}
        />
      </div>
    </Scrollbar>
  )
}

export default SubjectDepartments
