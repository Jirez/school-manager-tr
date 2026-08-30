import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import LogCodeAdd from '@/views/accounting/logCodes/LogCodeAdd'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ logCode, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      title={update ? t('action.update_logCode') : t('action.add_logCode')}
    >
      <Suspense>
        <LogCodeAdd modal={modal} logCode={logCode} />
      </Suspense>
    </ModalForm>
  )
})
