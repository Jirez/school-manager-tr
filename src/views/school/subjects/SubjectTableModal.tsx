import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const SubjectTable = lazy(() => import('@/views/school/subjects/SubjectTable'))

export default NiceModal.create(
  ({ subjects, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title={t('label-selectSubject')}
        autoFocus
        trapFocus
        scrollable={false}
        // onEnter={() => document.getElementById("quickFilter")?.focus()}
        // onExit={() => console.log("Goodbye my lover")}
        unmountOnClose
        // backdrop={true}
      >
        <Suspense>
          {/* @ts-ignore desc*/}
          <SubjectTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={subjects}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
