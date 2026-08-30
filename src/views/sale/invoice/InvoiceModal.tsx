import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import ModalForm from '@/@core/components/ui/modal-form'

const InvoiceAdd = lazy(() => import('./InvoiceAdd'))
const InvoiceUpdate = lazy(() => import('./InvoiceUpdate'))

export default NiceModal.create(({ invoice, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      fullscreen
      title={update ? t('action.update_invoice') : t('action.add_invoice')}
    >
      <Suspense>
        {update ? (
          <InvoiceUpdate modal={modal} invoice={invoice} />
        ) : (
          <InvoiceAdd modal={modal} invoice={invoice} />
        )}
      </Suspense>
    </ModalForm>
  )
})
