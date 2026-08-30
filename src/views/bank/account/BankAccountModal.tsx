import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
//import BankAccountAdd from "@views/bank/account/BankAccountAdd";
//import BankAccountUpdate from "@views/bank/account/BankAccountUpdate";
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'

const BankAccountAdd = lazy(() => import('./BankAccountAdd'))
const BankAccountUpdate = lazy(() => import('./BankAccountUpdate'))

export default NiceModal.create(({ bankAccount, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={
        update ? t('action.update_bankAccount') : t('action.add_bankAccount')
      }
    >
      <Suspense>
        {update ? (
          <BankAccountUpdate modal={modal} bankAccount={bankAccount} />
        ) : (
          <BankAccountAdd modal={modal} bankAccount={bankAccount} />
        )}
      </Suspense>
    </ModalForm>
  )
})
