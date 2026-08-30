import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const SimpleExpenseCategoryTable = lazy(
  () => import('./SimpleExpenseCategoryTable'),
)

export default NiceModal.create(
  ({ categories, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="modal-lg"
        title={t('label-selectCategory')}
        unmountOnClose
      >
        <Suspense>
          {/*@ts-ignore*/}
          <SimpleExpenseCategoryTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={categories}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
