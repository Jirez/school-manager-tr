import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { BankLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import BankTransactionModal from './BankTransactionModal'
import {
  BankTransactionCreatedDocument,
  useBankTransactionsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from './bankTransactionModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const BankTransactions = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(BankTransactionModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.bank.transactions'))

  const { data, error, loading, subscribeToMore, refetch } =
    useBankTransactionsQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.bankTransactions || [],
  })

  useLiveSubscription({
    subscribeToMore,
    document: BankTransactionCreatedDocument,
    listVar: 'bankTransactions',
    singleVar: 'bankTransaction',
    sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={BankLinks} />
      <Toolbar
        title={t('sidebar.bank.transactions')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_bankTransaction"
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

export default BankTransactions
