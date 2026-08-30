import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import GuardianAdd from './GuardianAdd'
import { Suspense } from 'react'
import GuardianUpdate from './GuardianUpdate'

export default NiceModal.create(
  ({ guardian, popover, currentIndex, update }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="max-w-5xl"
        title={update ? t('action.update_guardian') : t('action.add_guardian')}
      >
        <Suspense>
          {update ? (
            <GuardianUpdate
              modal={modal}
              guardian={guardian}
              popover={popover || false}
              currentIndex={currentIndex}
            />
          ) : (
            <GuardianAdd
              modal={modal}
              guardian={guardian}
              popover={popover || false}
              currentIndex={currentIndex}
            />
          )}
        </Suspense>
      </ModalForm>
    )
  },
)
