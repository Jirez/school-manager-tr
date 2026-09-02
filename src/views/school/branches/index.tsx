import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import BranchModal from '@/views/school/branches/BranchModal'
import { BranchCreatedDocument, useBranchesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './branchModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const Branches = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(BranchModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.branches'))

  const { data, error, loading, subscribeToMore, refetch } = useBranchesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.branches || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <div className="flex flex-col w-full">
      <Navs links={ClassLinks} />
      <Toolbar
        title={t('sidebar.school.branches')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_branch"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={BranchCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="branches"
          singleVar="branch"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {() => (
            <CustomTable modal={modal} table={table as any} loading={loading} />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default Branches
