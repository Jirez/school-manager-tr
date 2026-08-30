import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const TimeSlotAdd = lazy(() => import('./TimeSlotAdd'))
const TimeSlotUpdate = lazy(() => import('./TimeSlotUpdate'))

export default NiceModal.create(({ timeSlot, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={update ? t('action.update_timeSlot') : t('action.add_timeSlot')}
    >
      <Suspense>
        {update ? (
          <TimeSlotUpdate modal={modal} timeSlot={timeSlot} />
        ) : (
          <TimeSlotAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
