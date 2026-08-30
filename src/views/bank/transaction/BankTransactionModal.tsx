import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'

const BankTransactionAdd = lazy(() => import('./BankTransactionAdd'))
const BankTransactionUpdate = lazy(() => import('./BankTransactionUpdate'))

export default NiceModal.create(({ bankTransaction, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={
        update
          ? t('action.update_bankTransaction')
          : t('action.add_bankTransaction')
      }
    >
      <Suspense>
        {update ? (
          <BankTransactionUpdate
            modal={modal}
            bankTransaction={bankTransaction}
          />
        ) : (
          <BankTransactionAdd modal={modal} bankTransaction={bankTransaction} />
        )}
      </Suspense>
    </ModalForm>
  )
})
