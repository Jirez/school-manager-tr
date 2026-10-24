import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { TuitionLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useFeeGroupCreatedSubscription,
  useFeeGroupsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import { useTableColumns } from './feeGroupModel'
import FeeGroupModal from './FeeGroupModal'

const FeeGroups = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(FeeGroupModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.sales.feeGroups'))

  const { data, error, loading, refetch } = useFeeGroupsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.feeGroups || [],
  })

  const { data: subscriptionData } = useFeeGroupCreatedSubscription()

  useEffect(() => {
    if (subscriptionData) {
      refetch()
    }
  }, [subscriptionData])

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={TuitionLinks} />
      <Toolbar
        title={t('sidebar.sales.feeGroups')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_feeGroup"
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
          onRetry={refetch}
        />
      </div>
    </Scrollbar>
  )
}

export default FeeGroups
