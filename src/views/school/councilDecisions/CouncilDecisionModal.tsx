import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import CouncilDecisionAdd from './CouncilDecisionAdd'
import { Suspense } from 'react'

export default NiceModal.create(({ councilDecision, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      title={
        update
          ? t('action.update_councilDecision')
          : t('action.add_councilDecision')
      }
    >
      <Suspense>
        <CouncilDecisionAdd modal={modal} councilDecision={councilDecision} />
      </Suspense>
    </ModalForm>
  )
})
