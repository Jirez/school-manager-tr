import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const RoleUpdate = lazy(() => import('@/views/users/role/RoleUpdate'))
const RoleAdd = lazy(() => import('@/views/users/role/RoleAdd'))

export default NiceModal.create(({ role, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={update ? t('action.update_role') : t('action.add_role')}
      fullscreen
    >
      <Suspense>
        {update ? (
          <RoleUpdate modal={modal} role={role} />
        ) : (
          <RoleAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
