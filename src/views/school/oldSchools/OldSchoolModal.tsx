import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import OldSchoolAdd from './OldSchoolAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ oldSchool, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_oldSchool') : t('action.add_oldSchool')}
    >
      <Suspense>
        <OldSchoolAdd modal={modal} oldSchool={oldSchool} />
      </Suspense>
    </ModalForm>
  )
})
