import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import SpecialAccountAdd from './SpecialAccountAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ account, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_specialAccount')
          : t('action.add_specialAccount')
      }
    >
      <Suspense>
        <SpecialAccountAdd modal={modal} account={account} />
      </Suspense>
    </ModalForm>
  )
})
