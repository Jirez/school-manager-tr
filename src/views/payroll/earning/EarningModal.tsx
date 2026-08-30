import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const EarningAdd = lazy(() => import('./EarningAdd'))
const EarningUpdate = lazy(() => import('./EarningUpdate'))

export default NiceModal.create(({ earning, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-4xl"
      title={update ? t('action.update_earning') : t('action.add_earning')}
    >
      <Suspense>
        {update ? (
          <EarningUpdate modal={modal} earning={earning} />
        ) : (
          <EarningAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
