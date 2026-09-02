import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SpecialAccountModal from './SpecialAccountModal'
import {
  SpecialAccountCreatedDocument,
  useSpecialAccountsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './specialAccountModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const SpecialAccounts = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SpecialAccountModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.accounting.specialAccounts'))

  const { data, loading, error, subscribeToMore, refetch } =
    useSpecialAccountsQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.specialAccounts || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={AccountLinks} />
      <Toolbar
        title={t('sidebar.accounting.specialAccounts')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_specialAccount"
        onClick={() => modal.show()}
        refetch={() => refetch()}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={SpecialAccountCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="specialAccounts"
          singleVar="specialAccount"
          //sortField="name"
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

export default SpecialAccounts
