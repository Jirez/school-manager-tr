import NiceModal, { useModal } from '@ebay/nice-modal-react'
// import DrawerForm from "@components/ui/drawer-form";
import ModalForm from '@/@core/components/ui/modal-form'
import { lazy, Suspense } from 'react'
import { m } from '@/paraglide/messages'
import {
  FormSkeleton,
  SkeletonBlock,
} from '@/@core/components/ui/forms/form.style'

const BranchFormSkeleton = () => (
  <FormSkeleton aria-busy="true" aria-label="Loading branch form">
    <SkeletonBlock $width="35%" $height="1.25rem" />
    <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
      <SkeletonBlock />
      <SkeletonBlock />
      <SkeletonBlock />
    </div>
    <SkeletonBlock $width="45%" $height="1.25rem" />
    <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
      <SkeletonBlock />
      <SkeletonBlock />
      <SkeletonBlock />
      <SkeletonBlock />
    </div>
    <SkeletonBlock $height="10rem" />
  </FormSkeleton>
)

const BranchUpdate = lazy(() => import('./BranchUpdate'))
const BranchAdd = lazy(() => import('./BranchAdd'))

export default NiceModal.create(({ branch, update }: any) => {
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      // className="modal-full"
      fullscreen
      title={update ? m.action_update_branch() : m.action_add_branch()}
    >
      <Suspense fallback={<BranchFormSkeleton />}>
        {update ? (
          <BranchUpdate modal={modal} branch={branch} />
        ) : (
          <BranchAdd modal={modal} branch={branch} />
        )}
      </Suspense>
    </ModalForm>
  )
})
