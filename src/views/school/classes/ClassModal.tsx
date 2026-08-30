import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import ClassAdd from '@/views/school/classes/ClassAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ clazz, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_class') : t('action.add_class')}
    >
      <Suspense>
        <ClassAdd modal={modal} clazz={clazz} />
      </Suspense>
    </ModalForm>
  )
})
