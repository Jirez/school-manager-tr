import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import ChartOfAccountAdd from './ChartOfAccountAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ account, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-lg"
      title={
        update
          ? t('action.update_chartOfAccount')
          : t('action.add_chartOfAccount')
      }
    >
      <Suspense>
        <ChartOfAccountAdd modal={modal} account={account} />
      </Suspense>
    </ModalForm>
  )
})
