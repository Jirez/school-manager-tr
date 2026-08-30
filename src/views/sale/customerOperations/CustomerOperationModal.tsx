import ModalForm from '@/@core/components/ui/modal-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useAbility } from '@/context/Can'
import { Suspense, lazy } from 'react'

const InvoiceAdd = lazy(() => import('../invoice/InvoiceAdd'))
const InvoiceUpdate = lazy(() => import('@/views/sale/invoice/InvoiceUpdate'))

export default NiceModal.create(
  ({ operation, update, type, convert, refetch }: any) => {
    const modal = useModal()
    const { t } = useTranslation()
    const ability = useAbility()

    let title = ''
    if (type === 'SALES_RECEIPT') {
      title = 'action-sale'
    } else if (type === 'INVOICE') {
      title = 'action-invoice'
    } else if (type === 'CREDIT') {
      title = 'action-credit'
    } else if (type === 'PAYMENT') {
      title = 'action-payment'
    } else if (type === 'PROFORMA') {
      title = 'action-proforma'
    } else if (type === 'SCHOOL_FEES') {
      title = 'SCHOOL_FEES'
    }

    switch (convert) {
      case 'SALE_TO_INVOICE':
        title = 'action-invoice'
        break
      case 'SALE_DUPLICATE':
        title = 'action-sale'
        break
    }

    return (
      <ModalForm
        modal={modal}
        fullscreen
        title={
          update
            ? `${t('action.update_customerOperation')} - ${t(title)}`
            : `${t('action.add_customerOperation')} - ${t(title)}`
        }
        keyboard={false}
      >
        <Suspense>
          {/* {!update && type === "SALES_RECEIPT" && (
            <SaleAdd modal={modal} refetch={refetch} />
          )} */}

          {!update && type === 'INVOICE' && (
            <InvoiceAdd modal={modal} refetch={refetch} />
          )}

          {/* {!update && type === "CREDIT" && (
            <CreditAdd modal={modal} refetch={refetch} />
          )}

          {!update && type === "PAYMENT" && (
            <PaymentAdd modal={modal} refetch={refetch} />
          )}

          {!update && type === "PROFORMA" && (
            <ProformaAdd modal={modal} refetch={refetch} />
          )} */}

          {/* {convert && convert === "INVOICE" && (
            <InvoiceProformaAdd
              modal={modal}
              operation={operation}
              refetch={refetch}
            />
          )}

          {convert && convert === "SALE" && (
            <SaleProformaAdd
              modal={modal}
              operation={operation}
              refetch={refetch}
            />
          )}

          {convert && convert === "SALE_TO_INVOICE" && (
            <SaleToInvoiceAdd
              modal={modal}
              operation={operation}
              refetch={refetch}
            />
          )}

          {convert && convert === "SALE_DUPLICATE" && (
            <SaleDuplicate
              modal={modal}
              operation={operation}
              refetch={refetch}
            />
          )}

          {convert && convert === "PAYMENT" && (
            <PaymentReceive
              modal={modal}
              operation={operation}
              refetch={refetch}
            />
          )}

          {update &&
            (operation as any)?.operationType === "SALES_RECEIPT" &&
            ability.can("update", "sale") && (
              <SaleUpdate modal={modal} operation={operation} />
            )} */}

          {update &&
            ((operation as any)?.operationType === 'INVOICE' ||
              (operation as any)?.operationType === 'SCHOOL_FEES') &&
            ability.can('update', 'invoice') && (
              <InvoiceUpdate
                modal={modal}
                invoice={operation}
                refetch={refetch}
              />
            )}
        </Suspense>
      </ModalForm>
    )
  },
)
