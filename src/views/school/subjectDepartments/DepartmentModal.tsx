import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import DepartmentAdd from '@/views/school/subjectDepartments/DepartmentAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ department, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update ? t('action.update_department') : t('action.add_department')
      }
    >
      <Suspense>
        <DepartmentAdd modal={modal} department={department} />
      </Suspense>
    </ModalForm>
  )
})
