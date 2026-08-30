import NiceModal, { useModal } from '@ebay/nice-modal-react'
import ModalForm from '@/@core/components/ui/modal-form'
import SupplierCategoryAdd from '@/views/sale/supplier/category/SupplierCategoryAdd'
import SupplierCategoryUpdate from '@/views/sale/supplier/category/SupplierCategoryUpdate'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export default NiceModal.create(({ supplierCategory, update }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  return (
    <ModalForm
      modal={modal}
      className="modal-md"
      title={
        update
          ? t('action.update_supplierCategory')
          : t('action.add_supplierCategory')
      }
    >
      <Suspense>
        {update ? (
          <SupplierCategoryUpdate
            modal={modal}
            supplierCategory={supplierCategory}
          />
        ) : (
          <SupplierCategoryAdd
            modal={modal}
            supplierCategory={supplierCategory}
          />
        )}
      </Suspense>
    </ModalForm>
  )
})
