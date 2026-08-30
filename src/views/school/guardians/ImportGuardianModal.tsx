import DrawerForm from '@/@core/components/ui/drawer-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ImportGuardianForm from './importGuardianForm'
import { Suspense } from 'react'

export default NiceModal.create(({}) => {
  const modal = useModal()

  return (
    <DrawerForm
      modal={modal}
      className="w-full md:w-5/12"
      title={"Ajout des parents/tuteurs à partir d'un fichier"}
    >
      <Suspense>
        <ImportGuardianForm modal={modal} />
      </Suspense>
    </DrawerForm>
  )
})
