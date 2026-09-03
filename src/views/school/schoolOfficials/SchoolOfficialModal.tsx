import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SchoolOfficialAdd from '@/views/school/schoolOfficials/SchoolOfficialAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ schoolOfficial, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={
        update
          ? t('action.update_schoolOfficial')
          : t('action.add_schoolOfficial')
      }
    >
      <Suspense>
        <SchoolOfficialAdd modal={modal} schoolOfficial={schoolOfficial} />
      </Suspense>
    </ModalForm>
  )
})
