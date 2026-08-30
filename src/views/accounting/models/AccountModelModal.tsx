import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import AccountModelAdd from '@/views/accounting/models/AccountModelAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ accountModel, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={
        update ? t('action.update_accountModel') : t('action.add_accountModel')
      }
    >
      <Suspense>
        <AccountModelAdd modal={modal} accountModel={accountModel} />
      </Suspense>
    </ModalForm>
  )
})
