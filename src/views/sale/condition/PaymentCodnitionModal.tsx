import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const PaymentConditionAdd = lazy(() => import('./PaymentConditionAdd'))
const PaymentConditionUpdate = lazy(() => import('./PaymentConditionUpdate'))

export default NiceModal.create(({ paymentCondition, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_paymentCondition')
          : t('action.add_paymentCondition')
      }
    >
      <Suspense>
        {update ? (
          <PaymentConditionUpdate
            modal={modal}
            paymentCondition={paymentCondition}
          />
        ) : (
          <PaymentConditionAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
