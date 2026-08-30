import DrawerForm from '@/@core/components/ui/drawer-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ImportStudentForm from './ImportStudentForm'
import { Suspense } from 'react'

export default NiceModal.create(({ refetch }: any) => {
  const modal = useModal()

  return (
    <DrawerForm
      modal={modal}
      className="w-full md:w-5/12"
      title={"Ajout des élèves à partir d'un fichier"}
    >
      <Suspense>
        <ImportStudentForm modal={modal} refetch={refetch} />
      </Suspense>
    </DrawerForm>
  )
})
