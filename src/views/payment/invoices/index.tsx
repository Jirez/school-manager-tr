import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'

import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { InvoiceLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import StudentInvoiceTable from './StudentInvoiceTable'
import StudentInvoiceModal from './StudentInvoiceModal'
import {
  StudentInvoiceCreatedDocument,
  useStudentInvoicesQuery,
} from '@/gql/graphql'
import { useAbility } from '@/context/Can'
import { useTitle } from 'ahooks'

const StudentInvoices = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(StudentInvoiceModal)
  const { t } = useTranslation()
  const ability = useAbility()
  useTitle(t('sidebar.payments.invoices'))

  const { data, error, loading, subscribeToMore, refetch } =
    useStudentInvoicesQuery({
      variables: { id: enterpriseId },
    })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  return (
    <div className="flex flex-col w-full">
      <Navs links={InvoiceLinks} />
      <Toolbar
        title={t('sidebar.payments.invoices')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel={
          ability.can('write', 'invoice') ? 'action.add_studentInvoice' : ''
        }
        onClick={() => modal.show()}
        refetch={refetch}
      />

      {/* Table here */}
      <div>
        <LiveView
          document={StudentInvoiceCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="studentInvoices"
          singleVar="studentInvoice"
          //sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ studentInvoices }) => (
            <StudentInvoiceTable
              modal={modal}
              dataSource={studentInvoices}
              onGlobalFilterChanged={setFilterApi}
              loading={loading}
              refetch={refetch}
            />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default StudentInvoices
