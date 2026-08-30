import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import LevelModal from '@/views/school/levels/LevelModal'
import { LevelCreatedDocument, useLevelsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './levelModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const Levels = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(LevelModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.levels'))

  const { data, error, loading, subscribeToMore, refetch } = useLevelsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.levels || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

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
        <LiveView
          document={LevelCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="levels"
          singleVar="level"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ levels }) => (
            <CustomTable table={table} modal={modal} loading={loading} />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default Levels
