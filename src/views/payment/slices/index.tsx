import { useState } from 'react'
import { Card } from 'reactstrap'
import { useModal } from '@ebay/nice-modal-react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { PaymentLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { useTranslation } from 'react-i18next'
import PaymentSliceTable from '@/views/payment/slices/PaymentSliceTable'
import PaymentSliceModal from '@/views/payment/slices/PaymentSliceModal'
import {
  PaymentSliceCreatedDocument,
  usePaymentSlicesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const PaymentSlices = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PaymentSliceModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.slices'))

  const { data, error, loading, subscribeToMore, refetch } =
    usePaymentSlicesQuery({
      variables: { id: enterpriseId },
    })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PaymentLinks} />
      <Toolbar
        title={t('sidebar.payments.slices')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_paymentSlice"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <Card className="text-sm">
        <LiveView
          document={PaymentSliceCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="paymentSlices"
          singleVar="paymentSlice"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ paymentSlices }) => (
            <PaymentSliceTable
              modal={modal}
              dataSource={paymentSlices}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </Card>
    </Scrollbar>
  )
}

export default PaymentSlices
