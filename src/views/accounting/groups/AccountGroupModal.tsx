import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import AccountGroupAdd from '@/views/accounting/groups/AccountGroupAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ accountGroup, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update ? t('action.update_accountGroup') : t('action.add_accountGroup')
      }
    >
      <Suspense>
        <AccountGroupAdd modal={modal} accountGroup={accountGroup} />
      </Suspense>
    </ModalForm>
  )
})
