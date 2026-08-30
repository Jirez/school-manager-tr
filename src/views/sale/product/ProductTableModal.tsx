import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'

const SimpleProductTable = lazy(
  () => import('@/views/sale/product/SimpleProductTable'),
)

export default NiceModal.create(
  ({ products, onRowClicked, initialFilter }: any) => {
    const modal = useModal()
    const { t } = useTranslation()

    return (
      <ModalForm
        modal={modal}
        className="w-full max-w-6xl"
        title={t('label-selectProduct')}
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
          <SimpleProductTable
            onRowClicked={onRowClicked}
            modal={modal}
            dataSource={products}
            initialFilter={initialFilter}
          />
        </Suspense>
      </ModalForm>
    )
  },
)
