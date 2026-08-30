import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import UserAdd from '@/views/users/users/UserAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import UserUpdate from './UserUpdate'

export default NiceModal.create(({ user, update, history }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="max-w-5xl"
      title={update ? t('action.update_user') : t('action.add_user')}
    >
      <Suspense>
        {update ? (
          <UserUpdate user={user} history={history} modal={modal} />
        ) : (
          <UserAdd user={user} history={history} modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
