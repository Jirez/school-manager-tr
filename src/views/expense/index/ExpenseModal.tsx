import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const ExpenseAdd = lazy(() => import('./ExpenseAdd'))
const ExpenseUpdate = lazy(() => import('./ExpenseUpdate'))

export default NiceModal.create(({ expense, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      fullscreen
      className="modal-md"
      title={update ? t('action.update_expense') : t('action.add_expense')}
    >
      <Suspense>
        {update ? (
          <ExpenseUpdate modal={modal} expense={expense} />
        ) : (
          <ExpenseAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
