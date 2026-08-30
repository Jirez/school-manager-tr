import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const CashVoucherAdd = lazy(() => import('./CashVoucherAdd'))
const CashVoucherUpdate = lazy(() => import('./CashVoucherUpdate'))

export default NiceModal.create(({ voucher, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={
        update ? t('action.update_cashVoucher') : t('action.add_cashVoucher')
      }
    >
      <Suspense>
        {update ? (
          <CashVoucherUpdate modal={modal} voucher={voucher} />
        ) : (
          <CashVoucherAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
