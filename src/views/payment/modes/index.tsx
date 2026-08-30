import { useModal } from '@ebay/nice-modal-react'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PaymentLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import PaymentModeModal from '@/views/payment/modes/PaymentModeModal'
import { PaymentModeCreatedDocument, usePaymentModesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import { useTableColumns } from '@/views/payment/modes/paymentModeModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'

const PaymentModes = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PaymentModeModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.modes'))

  const { data, error, loading, subscribeToMore, refetch } =
    usePaymentModesQuery({
      variables: { id: enterpriseId },
    })

  const { columns } = useTableColumns(modal)

  const { table, setGlobalFilter, globalFilter, totalCount } = useTable<any>({
    columns,
    data: data?.paymentModes || [],
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PaymentLinks} />
      <Toolbar
        title={t('sidebar.payments.modes')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.add_paymentMode"
        onClick={() => modal.show()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="text-sm">
        <LiveView
          document={PaymentModeCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="paymentModes"
          singleVar="paymentMode"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ paymentModes }) => <CustomTable modal={modal} table={table} />}
        </LiveView>
      </div>
    </Scrollbar>
  )
}

export default PaymentModes
