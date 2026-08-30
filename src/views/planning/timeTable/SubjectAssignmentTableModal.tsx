import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SubjectAssignmentTable from './SubjectAssignmentTable'

export default NiceModal.create(
  ({ subjects, onRowClicked, onAddButtonClick }: any) => {
    const modal = useModal()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title="Sélectionner une matière"
      >
        <SubjectAssignmentTable
          //@ts-ignore
          onRowClicked={onRowClicked}
          modal={modal}
          dataSource={(subjects as any) || []}
          //@ts-ignore
          onAddButtonClick={onAddButtonClick}
        />
      </ModalForm>
    )
  },
)
