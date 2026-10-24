import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { expenseLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import ExpenseTable from './ExpenseTable'
import ExpenseModal from './ExpenseModal'
import { useTitle } from 'ahooks'
import { ExpenseCreatedDocument, useExpensesQuery } from '@/gql/graphql'
import { useLiveSubscription } from '#/hooks/useLiveSubscription'

const Expenses = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(ExpenseModal)
  const { t } = useTranslation()
  useTitle(t('text-expenses'))

  const { data, error, loading, subscribeToMore, refetch } = useExpensesQuery({
    variables: { id: enterpriseId },
  })

  useLiveSubscription({
    subscribeToMore,
    document: ExpenseCreatedDocument,
    listVar: 'expenses',
    singleVar: 'expense',
    // sortField: 'name',
    triggerUpdate: true,
    enterpriseId,
  })

  return (
    <div className="flex flex-col w-full">
      <Navs links={expenseLinks} />
      <Toolbar
        title={t('sidebar.expenses')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_expense"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div className="text-sm">
        <ExpenseTable
          modal={modal}
          dataSource={data?.expenses || []}
          onGlobalFilterChanged={setFilterApi}
          refetch={refetch}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default Expenses
