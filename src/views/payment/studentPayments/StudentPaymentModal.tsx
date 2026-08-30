import NiceModal, { useModal } from '@ebay/nice-modal-react'
import DrawerForm from '@/@core/components/ui/drawer-form'
import StudentPaymentAdd from '@/views/payment/studentPayments/StudentPaymentAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import StudentPaymentUpdate from './StudentPaymentUpdate'

export default NiceModal.create(({ studentPayment, update, refetch }: any) => {
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
          <StudentPaymentUpdate
            modal={modal}
            studentPayment={studentPayment}
            refetch={refetch}
          />
        ) : (
          <StudentPaymentAdd modal={modal} studentPayment={studentPayment} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
