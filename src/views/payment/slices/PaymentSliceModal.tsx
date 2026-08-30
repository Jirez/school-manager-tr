import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/@core/components/ui/modal-form'
import PaymentSliceAdd from '@/views/payment/slices/PaymentSliceAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ paymentSlice, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update ? t('action.update_paymentSlice') : t('action.add_paymentSlice')
      }
    >
      <Suspense>
        <PaymentSliceAdd modal={modal} paymentSlice={paymentSlice} />
      </Suspense>
    </ModalForm>
  )
})
