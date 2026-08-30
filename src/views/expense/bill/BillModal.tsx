import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import ModalForm from '@/@core/components/ui/modal-form'

const BillAdd = lazy(() => import('./BillAdd'))
const BillUpdate = lazy(() => import('./BillUpdate'))

export default NiceModal.create(({ bill, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      fullscreen
      title={update ? t('action.update_bill') : t('action.add_bill')}
    >
      <Suspense>
        {update ? (
          <BillUpdate modal={modal} bill={bill} />
        ) : (
          <BillAdd modal={modal} bill={bill} />
        )}
      </Suspense>
    </ModalForm>
  )
})
