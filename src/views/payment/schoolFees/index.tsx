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
import SchoolFeeTable from '@/views/payment/schoolFees/SchoolFeeTable'
import SchoolFeeModal from '@/views/payment/schoolFees/SchoolFeeModal'
import { SchoolFeeCreatedDocument, useSchoolFeesQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'

const SchoolFees = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(SchoolFeeModal)
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.schoolFees'))

  const { data, error, loading, subscribeToMore, refetch } = useSchoolFeesQuery(
    {
      variables: { id: enterpriseId },
    },
  )

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <Navs links={PaymentLinks} />
      <Toolbar
        title={t('sidebar.payments.schoolFees')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel="action.add_schoolFee"
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <Card className="text-sm">
        <LiveView
          document={SchoolFeeCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="schoolFees"
          singleVar="schoolFee"
          sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ schoolFees }) => (
            <SchoolFeeTable
              modal={modal}
              dataSource={schoolFees}
              onGlobalFilterChanged={setFilterApi}
            />
          )}
        </LiveView>
      </Card>
    </Scrollbar>
  )
}

export default SchoolFees
