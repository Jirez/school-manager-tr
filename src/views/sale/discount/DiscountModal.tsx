import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const DiscountAdd = lazy(() => import('./DiscountAdd'))
const DiscountUpdate = lazy(() => import('./DiscountUpdate'))

export default NiceModal.create(({ discount, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={update ? t('action.update_discount') : t('action.update_discount')}
    >
      <Suspense>
        {update ? (
          <DiscountUpdate modal={modal} discount={discount} />
        ) : (
          <DiscountAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
