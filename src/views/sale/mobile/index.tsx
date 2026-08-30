import { useEffect, useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { operationLinks } from '@/navigation/links'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { formatError } from '@/utils/ErrorHelper'
import { useMount, useTitle } from 'ahooks'
import { useMobileOperationsQuery } from '@/gql/graphql'
import dayjs from 'dayjs'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'
import { useForm } from 'react-hook-form'
import PeriodSelect from '@/views/report/report-helper'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import { useTableColumns } from './mobileOperationModel'
import { INPUT_DATE_FORMAT } from '@/utils/constants'
import CustomerOperationModal from '../customerOperations/CustomerOperationModal'
import { FilterSection } from '@/views/report/report.style'
import { FieldGrid } from '@/views/school/configuration/config-form-helper'

const MobileOperations = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(CustomerOperationModal)
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)
  useTitle(t('text-payments'))

  interface FormValues {
    period: [Date, Date]
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      period: [dayjs().add(-30, 'days').toDate(), dayjs().toDate()],
    },
  })

  const period = methods.watch('period') || []

  const { data, error, refetch, loading, subscribeToMore } =
    useMobileOperationsQuery({
      variables: {
        id: enterpriseId,
        startDate: dayjs().add(-30, 'days').format(INPUT_DATE_FORMAT),
        endDate: dayjs().format(INPUT_DATE_FORMAT),
      },
    })

  const { columns } = useTableColumns(modal, refetch)

  const { table, globalFilter, setGlobalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.mobileOperations || [],
  })

  const onPeriodFilterChanged = (period: any) => {
    refetch({
      startDate: dayjs(period[0]).format(INPUT_DATE_FORMAT),
      endDate: dayjs(period[1]).format(INPUT_DATE_FORMAT),
    })
  }

  useEffect(() => {
    onPeriodFilterChanged(period)
  }, [period])

  useMount(() => {
    setIsMounted(true)
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
    <div className="flex flex-col w-full overflow-auto">
      <Navs links={operationLinks} />
      <Toolbar
        title={t('sidebar.sales.mobileOperations')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        //extraButton={extraButton()}
        refetch={refetch}
        onClick={() => modal.show({ type: 'PROFORMA', refetch })}
        totalCount={totalCount}
      />

      {/* Table here */}
      <>
        <FilterSection>
          <FieldGrid $columns={2}>
            <PeriodSelect methods={methods} />
            <SimpleDatePicker
              name="period"
              label=""
              control={methods.control}
              options={{
                dateFormat: 'd/m/Y',
                mode: 'range',
                //defaultDate: [dayjs().toDate(), dayjs().toDate()],
                allowInput: true,
              }}
              //className="col-span-2"
            />
          </FieldGrid>
        </FilterSection>

        {isMounted && (
          <>
            <div className="mt-1 text-[0.8rem]">
              <CustomTable table={table} modal={modal} loading={loading} />
            </div>
          </>
        )}
      </>
    </div>
  )
}

export default MobileOperations
