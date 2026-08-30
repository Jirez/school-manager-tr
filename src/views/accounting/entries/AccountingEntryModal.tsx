import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import AccountingEntryAdd from './AccountingEntryAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ journal, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="w-full"
      title={update ? t('action.update_journal') : t('action.add_journal')}
      fullscreen
    >
      <Suspense>
        <AccountingEntryAdd modal={modal} journal={journal} />
      </Suspense>
    </ModalForm>
  )
})
