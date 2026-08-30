import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const PermissionUpdate = lazy(
  () => import('@/views/users/permission/PermissionUpdate'),
)
const PermissionAdd = lazy(
  () => import('@/views/users/permission/PermissionAdd'),
)

export default NiceModal.create(({ permission, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update ? t('action.update_permission') : t('action.add_permission')
      }
    >
      <Suspense>
        {update ? (
          <PermissionUpdate modal={modal} permission={permission} />
        ) : (
          <PermissionAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
