import { useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap'

import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { InvoiceLinks } from '@/navigation/links'
import LiveView from '@/utils/LiveView'
import StudentPaymentTable from '@/views/payment/studentPayments/StudentPaymentTable'
import StudentPaymentModal from '@/views/payment/studentPayments/StudentPaymentModal'
import InvoicePaymentModal from '../invoicePayments/InvoicePaymentModal'
import {
  StudentPaymentCreatedDocument,
  useStudentInvoiceCompulsoryStatusQuery,
  useStudentPaymentsQuery,
} from '@/gql/graphql'
import { useAbility } from '@/context/Can'
import { useTitle } from 'ahooks'

const StudentPayments = () => {
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const { enterpriseId } = useAuthentication()
  const modal = useModal(StudentPaymentModal)
  const invoiceModal = useModal(InvoicePaymentModal)
  const { t } = useTranslation()
  const ability = useAbility()
  useTitle(t('label-payments'))

  const { data, error, loading, subscribeToMore, refetch } =
    useStudentPaymentsQuery({
      variables: { id: enterpriseId },
    })

  const {
    data: compulsoryStatus,
    error: compulsoryStatusError,
    loading: compulsoryStatusLoading,
  } = useStudentInvoiceCompulsoryStatusQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  if (error || compulsoryStatusError) {
    return <div>Error! {error?.message || compulsoryStatusError?.message}</div>
  }

  if (compulsoryStatusLoading) {
    return <div>Loading...</div>
  }

  const extraButton = () =>
    ability.can('write', 'payment') && (
      <UncontrolledButtonDropdown className="w-full">
        <Button
          outline
          color="primary"
          className="round w-full"
          onClick={() => modal.show()}
        >
          {t('action.add_studentPayment')}
        </Button>
        <DropdownToggle
          outline
          className="dropdown-toggle-split round"
          color="primary"
          caret
        />
        <DropdownMenu>
          <DropdownItem tag="button" onClick={() => invoiceModal.show()}>
            {t('action.new_invoicePayment')}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    )

  return (
    <div className="flex flex-col w-full">
      <Navs links={InvoiceLinks} />
      <Toolbar
        title={t('sidebar.payments.students')}
        globalFilter={filterApi?.globalFilter}
        setGlobalFilter={filterApi?.setGlobalFilter}
        setDefaultGlobalFilter={filterApi?.setDefaultGlobalFilter}
        actionLabel={
          ability.can('write', 'payment') ? 'action.new_invoicePayment' : ''
        }
        onClick={() => {
          if (compulsoryStatus?.compulsoryStatus) {
            invoiceModal.show()
          } else {
            modal.show()
          }
        }}
        extraButton={!compulsoryStatus?.compulsoryStatus ? extraButton() : null}
        refetch={refetch}
      />

      {/* Table here */}
      <div>
        <LiveView
          document={StudentPaymentCreatedDocument}
          data={data}
          subscribeToMore={subscribeToMore}
          listVar="studentPayments"
          singleVar="studentPayment"
          //sortField="name"
          triggerUpdate={true}
          loading={loading}
          enterpriseId={enterpriseId}
        >
          {({ studentPayments }) => (
            <StudentPaymentTable
              modal={modal}
              dataSource={studentPayments}
              onGlobalFilterChanged={setFilterApi}
              refetch={refetch}
            />
          )}
        </LiveView>
      </div>
    </div>
  )
}

export default StudentPayments
