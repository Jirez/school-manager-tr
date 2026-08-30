import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const PositionAdd = lazy(() => import('./PositionAdd'))
const PositionUpdate = lazy(() => import('./PositionUpdate'))

export default NiceModal.create(({ position, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={update ? t('action.update_position') : t('action.add_position')}
    >
      <Suspense>
        {update ? (
          <PositionUpdate modal={modal} position={position} />
        ) : (
          <PositionAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
