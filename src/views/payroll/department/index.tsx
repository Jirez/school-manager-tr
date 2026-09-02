import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useDepartmentCreatedSubscription,
  useDepartmentsQuery,
} from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import { useTableColumns } from './departmentModel'
import DepartmentModal from './DepartmentModal'

const Departments = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(DepartmentModal)
  const [isMount, setIsMount] = useState(false)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.departments'))

  const { data, error, loading, refetch } = useDepartmentsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.departments || [],
  })

  const { data: subscriptionData } = useDepartmentCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.department?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

  useMount(() => {
    setIsMount(true)
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SupplierLinks} />
      <Toolbar
        title={t('sidebar.payroll.departments')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_department"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      {isMount && (
        <div className="text-sm">
          <CustomTable modal={modal} table={table as any} loading={loading} />
        </div>
      )}
    </Scrollbar>
  )
}

export default Departments
