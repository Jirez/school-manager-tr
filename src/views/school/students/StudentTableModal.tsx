import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SimpleStudentTable from '@/views/school/students/SimpleStudentTable'

export default NiceModal.create(
  ({ students, onRowClicked, onAddButtonClick }: any) => {
    const modal = useModal()

    return (
      <ModalForm
        modal={modal}
        className="modal-xl"
        title="Sélectionner un élève"
      >
        <SimpleStudentTable
          // @ts-ignore desc
          onRowClicked={onRowClicked}
          modal={modal}
          dataSource={(students as any) || []}
          // @ts-ignore desc
          onAddButtonClick={onAddButtonClick}
        />
      </ModalForm>
    )
  },
)
