import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const SimpleDeductionTable = lazy(
  () => import('@/views/payroll/deduction/SimpleDeductionTable'),
)

export default NiceModal.create(
  ({ deductions, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title={t('label-selectDeduction')}
        unmountOnClose
      >
        <Suspense>
          {/*@ts-ignore*/}
          <SimpleDeductionTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={deductions}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
