import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import CycleAdd from '@/views/school/cycles/CycleAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ cycle, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_cycle') : t('action.add_cycle')}
    >
      <Suspense>
        <CycleAdd modal={modal} cycle={cycle} />
      </Suspense>
    </ModalForm>
  )
})
