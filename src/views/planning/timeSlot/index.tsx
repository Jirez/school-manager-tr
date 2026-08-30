import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PlanningLinks } from '@/navigation/links'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import {
  useTimeSlotCreatedSubscription,
  useTimeSlotsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useEffect } from 'react'
import { useTableColumns } from './timeSlotModel'
import TimeSlotModal from './TimeSlotModal'
import { useMount } from 'ahooks'
import { useState } from 'react'

const TimeSlots = () => {
  const { enterpriseId } = useAuthentication()
  const [isMount, setIsMount] = useState(false)
  const modal = useModal(TimeSlotModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.planning.timeSlots'))

  const { data, error, loading, refetch } = useTimeSlotsQuery({
    variables: { id: enterpriseId },
  })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.timeSlots || [],
  })

  const { data: subscriptionData } = useTimeSlotCreatedSubscription()

  useEffect(() => {
    if (
      subscriptionData //&&
      //subscriptionData.timeSlot?.enterpriseId === enterpriseId
    ) {
      refetch()
    }
  }, [subscriptionData])

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
      <Navs links={PlanningLinks} />
      <Toolbar
        title={t('sidebar.planning.timeSlots')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_timeSlot"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <CustomTable modal={modal} table={table} loading={loading} />
      </div>
    </Scrollbar>
  )
}

export default TimeSlots
