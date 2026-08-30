import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const TuitionTable = lazy(() => import('@/views/sale/tuition/TuitionTable'))

export default NiceModal.create(
  ({ tuitions, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title={t('label-selectTuition')}
        autoFocus
        trapFocus
        scrollable={false}
        //onEnter={() => document.getElementById("quickFilter")?.focus()}
        //onExit={() => console.log("Goodbye my lover")}
        unmountOnClose
        //backdrop={true}
      >
        <Suspense>
          {/*@ts-ignore*/}
          <TuitionTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={tuitions}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
