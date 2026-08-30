import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import TeacherTable from '@/views/school/teacher/TeacherTable'

export default NiceModal.create(({ teachers, onRowClicked }: any) => {
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title="Sélectionner un enseignant"
    >
      {/* @ts-ignore desc*/}
      <TeacherTable
        onRowClicked={onRowClicked}
        modal={modal}
        dataSource={teachers}
      />
    </ModalForm>
  )
})
