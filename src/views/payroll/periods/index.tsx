import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PayrollLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  usePayrollPeriodCreatedSubscription,
  usePayrollPeriodsQuery,
} from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import { useTableColumns } from './payrollPeriodModel'
import PayrollPeriodModal from './PayrollPeriodModal'

const PayrollPeriods = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PayrollPeriodModal)
  const [isMount, setIsMount] = useState(false)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.periods'))

  const { data, error, loading, refetch } = usePayrollPeriodsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.payrollPeriods || [],
  })

  const { data: subscriptionData } = usePayrollPeriodCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.payrollPeriod?.enterpriseId === enterpriseId
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
        title={t('sidebar.payroll.periods')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_period"
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

export default PayrollPeriods
