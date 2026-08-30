import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SimpleGuardianTable from './SimpleGuardianTable'

export default NiceModal.create(
  ({ guardians, onRowClicked, onAddButtonClick }: any) => {
    const modal = useModal()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title="Sélectionner un parent/tuteur"
      >
        <SimpleGuardianTable
          // @ts-ignore desc
          onRowClicked={onRowClicked}
          modal={modal}
          dataSource={(guardians as any[]) || []}
          onAddButtonClick={onAddButtonClick}
        />
      </ModalForm>
    )
  },
)
