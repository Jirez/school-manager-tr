import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import CompetenceUpdate from './CompetenceUpdate'
import CompetenceAdd from './CompetenceAdd'

export default NiceModal.create(({ competence, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="max-w-3xl"
      title={
        update ? t('action.update_competence') : t('action.add_competence')
      }
    >
      <Suspense>
        {update ? (
          <CompetenceUpdate modal={modal} competence={competence} />
        ) : (
          <CompetenceAdd modal={modal} competence={competence} />
        )}
      </Suspense>
    </ModalForm>
  )
})
