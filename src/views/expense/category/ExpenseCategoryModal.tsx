import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const ExpenseCategoryAdd = lazy(() => import('./ExpenseCategoryAdd'))
const ExpenseCategoryUpdate = lazy(() => import('./ExpenseCategoryUpdate'))

export default NiceModal.create(({ expenseCategory, update }: any) => {
  const { t } = useTranslation()
  const modal = useModal()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={
        update
          ? t('action.update_expenseCategory')
          : t('action.add_expenseCategory')
      }
    >
      <Suspense>
        {update ? (
          <ExpenseCategoryUpdate
            modal={modal}
            expenseCategory={expenseCategory}
          />
        ) : (
          <ExpenseCategoryAdd modal={modal} />
        )}
      </Suspense>
    </ModalForm>
  )
})
