import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import PaymentModeAdd from '@/views/payment/modes/PaymentModeAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ paymentMode, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update ? t('action.update_paymentMode') : t('action.add_paymentMode')
      }
    >
      <Suspense>
        <PaymentModeAdd modal={modal} paymentMode={paymentMode} />
      </Suspense>
    </ModalForm>
  )
})
