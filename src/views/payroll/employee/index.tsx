import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useEmployeeCreatedSubscription,
  useEmployeesQuery,
} from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import { useTableColumns } from './employeeModel'
import EmployeeModal from './EmployeeModal'
import { PayrollLinks } from '@/navigation/links'
import Navs from '@/@core/components/navs/navs'

const Employees = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(EmployeeModal)
  const [isMount, setIsMount] = useState(false)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.employees'))

  const { data, error, loading, refetch } = useEmployeesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.employees || [],
  })

  const { data: subscriptionData } = useEmployeeCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.employee?.enterpriseId === enterpriseId
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
      <Navs links={PayrollLinks} />
      <Toolbar
        title={t('sidebar.payroll.employees')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_employee"
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

export default Employees
