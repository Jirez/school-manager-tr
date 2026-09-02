import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import AccountModal from './AccountModal'
import { AccountCreatedDocument, useAccountsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './accountModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useMount } from 'ahooks'
import { useState } from 'react'

const Accounts = () => {
  const { enterpriseId } = useAuthentication()
  const [isMounted, setIsMounted] = useState(false)
  const modal = useModal(AccountModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.accounting.chartOfAccount'))

  const { data, loading, error, subscribeToMore, refetch } = useAccountsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.accounts || [],
  })

  useMount(() => {
    setIsMounted(true)
  })

  if (!isMounted) {
    return null
  }

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={AccountLinks} />
      <Toolbar
        title={t('sidebar.accounting.chartOfAccount')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_account"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={AccountCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="accounts"
          singleVar="account"
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

export default Accounts
