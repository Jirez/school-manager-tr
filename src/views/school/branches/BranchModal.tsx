import NiceModal, { useModal } from '@ebay/nice-modal-react'
import BranchAdd from '@/views/school/branches/BranchAdd'
import { useTranslation } from 'react-i18next'
// import DrawerForm from "@components/ui/drawer-form";
import ModalForm from '@/@core/components/ui/modal-form'
import { Suspense } from 'react'
import BranchUpdate from './BranchUpdate'

export default NiceModal.create(({ branch, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      // className="modal-full"
      fullscreen
      title={update ? t('action.update_branch') : t('action.add_branch')}
    >
      <Suspense>
        {update ? (
          <BranchUpdate modal={modal} branch={branch} />
        ) : (
          <BranchAdd modal={modal} branch={branch} />
        )}
      </Suspense>
    </ModalForm>
  )
})
