import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { BankLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import BankAccountModal from '@/views/bank/account/BankAccountModal'
import { BankAccountCreatedDocument, useBankAccountsQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './bankAccountModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const BankAccounts = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(BankAccountModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.bank.accounts'))

  const { data, error, loading, subscribeToMore, refetch } =
    useBankAccountsQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.bankAccounts || [],
  })

  useLiveSubscription({
    subscribeToMore,
    document: BankAccountCreatedDocument,
    listVar: 'bankAccounts',
    singleVar: 'bankAccount',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={BankLinks} />
      <Toolbar
        title={t('sidebar.bank.accounts')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_bankAccount"
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

export default BankAccounts
