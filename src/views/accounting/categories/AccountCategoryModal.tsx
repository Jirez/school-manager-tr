import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import AccountCategoryAdd from '@/views/accounting/categories/AccountCategoryAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ category, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      title={
        update
          ? t('action.update_accountCategory')
          : t('action.add_accountCategory')
      }
    >
      <Suspense>
        <AccountCategoryAdd modal={modal} category={category} />
      </Suspense>
    </ModalForm>
  )
})
