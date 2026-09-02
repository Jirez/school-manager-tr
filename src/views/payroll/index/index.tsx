import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PayrollLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import { useTitle } from 'ahooks'
import { PayrollCreatedDocument, usePayrollsQuery } from '@/gql/graphql'
import PayrollModal from './PayrollModal'
import { useTableColumns } from './payrollModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const Payrolls = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PayrollModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payroll.list'))

  const { data, error, loading, subscribeToMore, refetch } = usePayrollsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal, refetch)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.payrolls || [],
  })

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          message={formatError(error)}
          title={t('label-graphqlError')}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <Navs links={PayrollLinks} />
      <Toolbar
        title={t('sidebar.payroll.list')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_payroll"
        onClick={() => modal.show()}
        refetch={refetch}
        abilitySubject="payroll"
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={PayrollCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="payrolls"
          singleVar="payroll"
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {() => (
            <CustomTable table={table as any} modal={modal} loading={loading} />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default Payrolls
