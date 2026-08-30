import NiceModal, { useModal } from '@ebay/nice-modal-react'
// import Drawer from "@components/ui/drawer/drawer";
import SubjectAdd from '@/views/school/subjects/SubjectAdd'
import SubjectUpdate from '@/views/school/subjects/SubjectUpdate'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ subject, update = false, refetch }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_subject') : t('action.add_subject')}
    >
      <Suspense>
        {update ? (
          <SubjectUpdate modal={modal} subject={subject} refetch={refetch} />
        ) : (
          <SubjectAdd modal={modal} refetch={refetch} />
        )}
      </Suspense>
    </ModalForm>
  )
})
