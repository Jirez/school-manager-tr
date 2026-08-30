import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const EvalTypeTable = lazy(
  () => import('@/views/primary/eval/SimpleEvalTypeTable'),
)

export default NiceModal.create(
  ({ evalTypes, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title={t('label-selectEvalType', "Sélectionner un type d'évaluation")}
        autoFocus
        trapFocus
        scrollable={false}
        unmountOnClose
      >
        <Suspense>
          {/* @ts-ignore */}
          <EvalTypeTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={evalTypes}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
