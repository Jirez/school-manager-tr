import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { expenseLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import ExpenseTable from './ExpenseTable'
import ExpenseModal from './ExpenseModal'
import { useTitle } from 'ahooks'
import { ExpenseCreatedDocument, useExpensesQuery } from '@/gql/graphql'

const Expenses = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(ExpenseModal)
  const { t } = useTranslation()
  useTitle(t('text-expenses'))

  const { data, error, loading, subscribeToMore, refetch } = useExpensesQuery({
    variables: { id: enterpriseId },
  })

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          message={formatError(error)}
          title={t('label-graphqlError')}
        />
      </div>
    )
  }

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
        <LiveView
          document={ExpenseCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="expenses"
          singleVar="expense"
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ expenses }) => (
            <ExpenseTable
              modal={modal}
              dataSource={expenses}
              onGlobalFilterChanged={setFilterApi}
              refetch={refetch}
            />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default Expenses
