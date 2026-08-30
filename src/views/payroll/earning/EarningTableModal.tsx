import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const SimpleEarningTable = lazy(
  () => import('@/views/payroll/earning/SimpleEarningTable'),
)

export default NiceModal.create(
  ({ earnings, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title={t('label-selectEarning')}
        unmountOnClose
      >
        <Suspense>
          {/*@ts-ignore*/}
          <SimpleEarningTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={earnings}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
