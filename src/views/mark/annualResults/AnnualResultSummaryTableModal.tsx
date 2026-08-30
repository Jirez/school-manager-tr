import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import AnnualResultSummaryTable from './AnnualResultSummaryTable'

export default NiceModal.create(({ dataSource }: any) => {
  const modal = useModal()

  return (
    <ModalForm modal={modal} className="modal-lg" title="Résumé des classes">
      <AnnualResultSummaryTable
        modal={modal}
        dataSource={(dataSource as any) || []}
      />
    </ModalForm>
  )
})
