import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'
import DrawerForm from '@/@core/components/ui/drawer-form'
//import SupplierAdd from "./SupplierAdd";
//import SupplierUpdate from "./SupplierUpdate";

const SupplierAdd = lazy(() => import('./SupplierAdd'))
const SupplierUpdate = lazy(() => import('./SupplierUpdate'))

export default NiceModal.create(({ supplier, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <DrawerForm
      modal={modal}
      className="max-w-6xl"
      title={update ? t('action.update_supplier') : t('action.add_supplier')}
    >
      <Suspense>
        {update ? (
          <SupplierUpdate modal={modal} supplier={supplier} />
        ) : (
          <SupplierAdd modal={modal} supplier={supplier} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
