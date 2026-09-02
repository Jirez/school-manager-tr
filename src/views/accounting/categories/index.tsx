import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { AccountLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@//@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import AccountCategoryModal from '@/views/accounting/categories/AccountCategoryModal'
import {
  AccountCategoryCreatedDocument,
  useAccountCategoriesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './accountCategoryModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const AccountCategories = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(AccountCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.accounting.categories'))

  const { data, error, loading, subscribeToMore, refetch } =
    useAccountCategoriesQuery()

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.accountCategories || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={AccountLinks} />
      <Toolbar
        title={t('sidebar.accounting.categories')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_accountCategory"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={AccountCategoryCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="accountCategories"
          singleVar="accountCategory"
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
    </Scrollbar>
  )
}

export default AccountCategories
