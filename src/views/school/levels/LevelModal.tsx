import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import LevelAdd from '@/views/school/levels/LevelAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ level, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={update ? t('action.update_level') : t('action.add_level')}
    >
      <Suspense>
        <LevelAdd modal={modal} level={level} />
      </Suspense>
    </ModalForm>
  )
})
