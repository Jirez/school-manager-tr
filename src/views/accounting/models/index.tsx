import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import AccountModelModal from '@/views/accounting/models/AccountModelModal'
import { useAccountModelsQuery } from '@/gql/graphql'
import { AccountModelCreatedDocument } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './accountModelModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const AccountModels = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(AccountModelModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.accounting.models'))

  const { data, error, loading, subscribeToMore, refetch } =
    useAccountModelsQuery()

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    data: data?.accountModels || [],
    columns,
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={AccountLinks} />
      <Toolbar
        title={t('sidebar.accounting.models')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_accountModel"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={AccountModelCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="accountModels"
          singleVar="accountModel"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {() => (
            <CustomTable table={table as any} modal={modal} loading={loading} />
          )}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default AccountModels
