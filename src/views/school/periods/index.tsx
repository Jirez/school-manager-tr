import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PeriodLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import PeriodModal from '@/views/school/periods/PeriodModal'
import { PeriodCreatedDocument, usePeriodsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './periodModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const Periods = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PeriodModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.periods'))

  const { data, error, loading, subscribeToMore, refetch } = usePeriodsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.periods || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PeriodLinks} />
      <Toolbar
        title={t('sidebar.school.periods')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_period"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={PeriodCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="periods"
          singleVar="period"
          sortField="numberOrder"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ periods }) => (
            <CustomTable table={table} modal={modal} loading={loading} />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default Periods
