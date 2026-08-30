import DrawerForm from '@/@core/components/ui/drawer-form'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'

import { Suspense, lazy } from 'react'
//import ProductBundleAdd from "../productBundle/ProductBundleAdd";

const ArticleAdd = lazy(() => import('../article/ArticleAdd'))
const ArticleUpdate = lazy(() => import('../article/ArticleUpdate'))
const ServiceAdd = lazy(() => import('../service/ServiceAdd'))
const ServiceUpdate = lazy(() => import('../service/ServiceUpdate'))
const TuitionAdd = lazy(() => import('../tuition/TuitionAdd'))
const TuitionUpdate = lazy(() => import('../tuition/TuitionUpdate'))

export default NiceModal.create(({ product, update, type, refetch }: any) => {
  const modal = useModal()
  const { t } = useTranslation()

  const getTitle = () => {
    if (update) {
      if ((product as any)?.productType === 'SERVICE') {
        return t('action.update_service')
      }
      if ((product as any)?.productType === 'TUITION') {
        return t('action.update_tuition')
      }
      return t('action.update_product')
    } else {
      if (type === 'SERVICE') {
        return t('action.add_service')
      }
      if (type === 'TUITION') {
        return t('action.add_tuition')
      }
      return t('action.add_product')
    }
  }

  return (
    <DrawerForm
      modal={modal}
      className="max-w-6xl"
      title={getTitle()}
      unmountOnClose
    >
      <Suspense>
        {!update && type === 'ARTICLE' && (
          <ArticleAdd modal={modal} refetch={refetch} />
        )}

        {!update && type === 'SERVICE' && (
          <ServiceAdd modal={modal} refetch={refetch} />
        )}
        {!update && type === 'TUITION' && (
          <TuitionAdd modal={modal} refetch={refetch} />
        )}

        {update && (product as any)?.productType === 'ARTICLE' && (
          <ArticleUpdate modal={modal} product={product} refetch={refetch} />
        )}

        {update && (product as any)?.productType === 'SERVICE' && (
          <ServiceUpdate modal={modal} product={product} refetch={refetch} />
        )}
        {update && (product as any)?.productType === 'TUITION' && (
          <TuitionUpdate modal={modal} product={product} refetch={refetch} />
        )}
      </Suspense>
    </DrawerForm>
  )
})
