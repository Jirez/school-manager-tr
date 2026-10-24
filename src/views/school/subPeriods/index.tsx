import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PeriodLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SubPeriodModal from '@/views/school/subPeriods/SubPeriodModal'
import { SubPeriodCreatedDocument, useSubPeriodsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './subPeriodModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const SubPeriods = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SubPeriodModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.subPeriods'))

  const { data, error, loading, subscribeToMore, refetch } = useSubPeriodsQuery(
    {
      variables: { id: enterpriseId },
    },
  )

  useLiveSubscription({
    subscribeToMore,
    document: SubPeriodCreatedDocument,
    listVar: 'subPeriods',
    singleVar: 'subPeriod',
    sortField: 'numberOrder',
    triggerUpdate: true,
    enterpriseId,
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.subPeriods || [],
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PeriodLinks} />
      <Toolbar
        title={t('sidebar.school.subPeriods')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_subPeriod"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable
          table={table as any}
          modal={modal}
          loading={loading}
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    </Scrollbar>
  )
}

export default SubPeriods
