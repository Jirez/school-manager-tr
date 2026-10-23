import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { ClassLinks } from '@/navigation/links'
import { useLiveSubscription } from '@/hooks/useLiveSubscription'
import BranchModal from '@/views/school/branches/BranchModal'
import { BranchCreatedDocument, useBranchesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './branchModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { m } from '@/paraglide/messages'

const Branches = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(BranchModal)
  useTitle(m.label_branches())

  const { data, error, loading, subscribeToMore, refetch } = useBranchesQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: BranchCreatedDocument,
    listVar: 'branches',
    singleVar: 'branch',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.branches || [],
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={ClassLinks} />
      <Toolbar
        title={m.label_branches()}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_branch"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable
          modal={modal}
          table={table as any}
          loading={loading}
          error={error}
          onRetry={() => refetch()}
        />
      </div>
    </div>
  )
}

export default Branches
