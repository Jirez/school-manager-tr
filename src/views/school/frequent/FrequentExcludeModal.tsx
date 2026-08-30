import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'
import FrequentExcludeForm from './FrequentExcludeForm'

export default NiceModal.create(
  ({ studentId, classId, schoolYearId, update }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-md"
        title={
          update ? t('action.update_paymentMode') : t('action.add_paymentMode')
        }
      >
        <Suspense>
          <FrequentExcludeForm
            modal={modal}
            input={{
              studentId,
              classId,
              schoolYearId,
              excluded: false,
              exclusionDate: null,
              exclusionReason: '',
            }}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
