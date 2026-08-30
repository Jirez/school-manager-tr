import DrawerForm from '@/@core/components/ui/drawer-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ImportTeacherForm from './ImportTeacherForm'

export default NiceModal.create(({}) => {
  const modal = useModal()

  return (
    <DrawerForm
      modal={modal}
      className="w-full md:w-5/12"
      title={"Ajout du personnel à partir d'un fichier"}
    >
      <ImportTeacherForm modal={modal} />
    </DrawerForm>
  )
})
