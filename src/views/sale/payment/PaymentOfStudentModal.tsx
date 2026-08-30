import NiceModal, { useModal } from '@ebay/nice-modal-react'
import DrawerForm from '@/@core/components/ui/drawer-form'
import StudentPaymentAdd from './PaymentOfStudentAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(
  ({ payment, invoiceId, update, refetch }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <DrawerForm
        modal={modal}
        className="w-full"
        title={
          update
            ? t('action.update_studentPayment')
            : t('action.add_studentPayment')
        }
      >
        <Suspense>
          {update ? (
            <span />
          ) : (
            <StudentPaymentAdd
              modal={modal}
              payment={payment}
              invoiceId={invoiceId}
              refetch={refetch}
            />
          )}
        </Suspense>
      </DrawerForm>
    )
  },
)
