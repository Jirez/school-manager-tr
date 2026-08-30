import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SimpleFrequentTable from '@/views/school/frequent/SimpleFrequentTable'

export default NiceModal.create(({ students, onRowClicked }: any) => {
  const modal = useModal()

  return (
    <ModalForm modal={modal} className="modal-xl" title="Sélectionner un élève">
      {/* @ts-ignore desc*/}
      <SimpleFrequentTable
        onRowClicked={onRowClicked}
        modal={modal}
        dataSource={students}
      />
    </ModalForm>
  )
})
