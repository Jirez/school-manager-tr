import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import AccountAdd from './AccountAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ account, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={update ? t('action.update_account') : t('action.add_account')}
    >
      <Suspense>
        <AccountAdd modal={modal} account={account} />
      </Suspense>
    </ModalForm>
  )
})
