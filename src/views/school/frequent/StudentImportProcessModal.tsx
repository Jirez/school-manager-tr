import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense } from 'react'
import StudentImportProcessForm from './StudentImportProcessForm'
import ModalForm from '@/@core/components/ui/modal-form'

export default NiceModal.create(({ refetch }: any) => {
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="w-full"
      title={"Ajout interactif des élèves à partir d'un fichier"}
      fullscreen
    >
      <Suspense>
        <StudentImportProcessForm modal={modal} refetch={refetch} />
      </Suspense>
    </ModalForm>
  )
})
