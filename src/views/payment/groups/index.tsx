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
import PaymentGroupTable from '@/views/payment/groups/PaymentGroupTable'
import PaymentGroupModal from '@/views/payment/groups/PaymentGroupModal'
import {
  PaymentGroupCreatedDocument,
  usePaymentGroupsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const PaymentGroups = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(PaymentGroupModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.groups'))

  const { data, error, loading, subscribeToMore, refetch } =
    usePaymentGroupsQuery({
      variables: { id: enterpriseId },
    })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PaymentLinks} />
      <Toolbar
        title={t('sidebar.payments.groups')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_paymentGroup"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <Card className="text-sm">
        <LiveView
          document={PaymentGroupCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="paymentGroups"
          singleVar="paymentGroup"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ paymentGroups }) => (
            <PaymentGroupTable
              modal={modal}
              dataSource={paymentGroups}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </Card>
    </Scrollbar>
  )
}

export default PaymentGroups
