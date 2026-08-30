import NiceModal, { useModal } from '@ebay/nice-modal-react'
import StudentAdd from '@/views/school/students/StudentAdd'
import { useTranslation } from 'react-i18next'
import ModalForm from '@/@core/components/ui/modal-form'
import { Suspense } from 'react'

export default NiceModal.create(({ student, update, refetch }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-xl w-full"
      title={update ? t('action.update_student') : t('action.add_student')}
    >
      <Suspense>
        <StudentAdd
          modal={modal}
          student={student}
          popover={true}
          refetch={refetch}
        />
      </Suspense>
    </ModalForm>
  )
})
