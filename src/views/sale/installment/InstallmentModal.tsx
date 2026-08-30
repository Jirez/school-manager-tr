import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const InstallmentAdd = lazy(() => import('./InstallmentAdd'))
const InstallmentUpdate = lazy(() => import('./InstallmentUpdate'))

export default NiceModal.create(({ installment, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-5xl"
      title={
        update ? t('action.update_installment') : t('action.add_installment')
      }
    >
      <Suspense>
        {update ? (
          <InstallmentUpdate modal={modal} installment={installment} />
        ) : (
          <InstallmentAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
