import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import CycleModal from '@/views/school/cycles/CycleModal'
import { CycleCreatedDocument, useCyclesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './cycleModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Cycles = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(CycleModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.cycles'))

  const { data, error, loading, subscribeToMore, refetch } = useCyclesQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: CycleCreatedDocument,
    listVar: 'cycles',
    singleVar: 'cycle',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.cycles || [],
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={ClassLinks} />
      <Toolbar
        title={t('sidebar.school.cycles')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_cycle"
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

export default Cycles
