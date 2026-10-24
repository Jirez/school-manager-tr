import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useDayOfClassCreatedSubscription,
  useDayOfClassesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import { useTableColumns } from './dayOfClassModel'
import DayOfClassModal from './DayOfClassModal'
import { PlanningLinks } from '#/navigation/links'

const DayOfClass = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(DayOfClassModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.planning.dayOfClass'))

  const { data, error, loading, refetch } = useDayOfClassesQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.dayOfClasses || [],
  })

  const { data: subscriptionData } = useDayOfClassCreatedSubscription()

  useEffect(() => {
    if (subscriptionData) {
      refetch()
    }
  }, [subscriptionData])

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PlanningLinks} />
      <Toolbar
        title={t('sidebar.planning.dayOfClass')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_dayOfClass"
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

export default DayOfClass
