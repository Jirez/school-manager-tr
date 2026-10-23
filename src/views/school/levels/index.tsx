import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import LevelModal from '@/views/school/levels/LevelModal'
import { LevelCreatedDocument, useLevelsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './levelModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Levels = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(LevelModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.levels'))

  const { data, error, loading, subscribeToMore, refetch } = useLevelsQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: LevelCreatedDocument,
    listVar: 'levels',
    singleVar: 'level',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.levels || [],
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={ClassLinks} />
      <Toolbar
        title={t('sidebar.school.levels')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_level"
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

export default Levels
