import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SchoolSectionAdd from '@/views/school/schoolSections/SchoolSectionAdd'
import { Suspense } from 'react'
import { m } from '@/paraglide/messages'

export default NiceModal.create(({ schoolSection, update }: any) => {
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-4xl"
      title={
        update ? m.action_update_schoolSection() : m.action_add_schoolSection()
      }
    >
      <Suspense>
        <SchoolSectionAdd modal={modal} schoolSection={schoolSection} />
      </Suspense>
    </ModalForm>
  )
})
