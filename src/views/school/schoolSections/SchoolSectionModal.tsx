import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SchoolSectionAdd from '@/views/school/schoolSections/SchoolSectionAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ schoolSection, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={
        update
          ? t('action.update_schoolSection')
          : t('action.add_schoolSection')
      }
    >
      <Suspense>
        <SchoolSectionAdd modal={modal} schoolSection={schoolSection} />
      </Suspense>
    </ModalForm>
  )
})
