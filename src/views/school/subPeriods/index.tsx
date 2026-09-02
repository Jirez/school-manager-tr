import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PeriodLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import SubPeriodModal from '@/views/school/subPeriods/SubPeriodModal'
import { SubPeriodCreatedDocument, useSubPeriodsQuery } from '@/gql/graphql'
import { useMount, useTitle } from 'ahooks'
import { useTableColumns } from './subPeriodModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useState } from 'react'

const SubPeriods = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SubPeriodModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.school.subPeriods'))
  const [isMount, setIsMount] = useState(false)

  const { data, error, loading, subscribeToMore, refetch } = useSubPeriodsQuery(
    {
      variables: { id: enterpriseId },
    },
  )

  const { columns } = useTableColumns(modal)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.subPeriods || [],
  })

  useMount(() => {
    setIsMount(true)
  })

  if (!isMount) {
    return null
  }

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PeriodLinks} />
      <Toolbar
        title={t('sidebar.school.subPeriods')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_subPeriod"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={SubPeriodCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="subPeriods"
          singleVar="subPeriod"
          sortField="numberOrder"
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

export default SubPeriods
