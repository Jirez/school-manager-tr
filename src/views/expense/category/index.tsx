import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { SupplierLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useExpenseCategoriesQuery,
  useExpenseCategoryCreatedSubscription,
} from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect, useState } from 'react'
import ExpenseCategoryModal from './ExpenseCategoryModal'
import { useTableColumns } from './expenseCategoryModel'

const ExpenseCategories = () => {
  const [isMount, setIsMount] = useState(false)
  const { enterpriseId } = useAuthentication()
  const modal = useModal(ExpenseCategoryModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.expenses.categories'))

  const { data, error, loading, refetch } = useExpenseCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.expenseCategories || [],
  })

  const { data: subscriptionData } = useExpenseCategoryCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData &&
      subscriptionData.expenseCategory?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

  useMount(() => {
    setIsMount(true)
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={SupplierLinks} />
      <Toolbar
        title={t('sidebar.expenses.categories')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_expenseCategory"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
        abilitySubject="expense"
      />

      {/* Table here */}
      {isMount && (
        <div className="text-sm">
          <CustomTable modal={modal} table={table} loading={loading} />
        </div>
      )}
    </Scrollbar>
  )
}

export default ExpenseCategories
