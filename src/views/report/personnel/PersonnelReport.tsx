import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { useSearch } from '../useReportSearch'
import CustomReportModal from '../CustomReportModal'
import Button from '@/@core/components/button'

const PersonnelReport = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    setValues,
    params,
    values: currentValues,
    show,
  } = useSearch({
    title: t('label-personnelReport'),
    orientation: 'LANDSCAPE',
    columnBorder: true,
    rowNumber: true,
    pageType: 'A3',
  })
  const modal = useModal(CustomReportModal)

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-personnelReport')} returnLink="/reports" />
      </div>

      <>
        <div className="flex justify-end">
          <Button
            type="button"
            color="secondary"
            className="round h-10 mt-1"
            onClick={() =>
              modal.show({ options: { ...currentValues }, setValues })
            }
          >
            {t('label-customizeReport')}
          </Button>
        </div>
      </>

      <div className="w-full mt-2">
        {show && (
          <PdfViewer
            url={`reports/personnel-list-${enterpriseId}.pdf?params=${params}`}
          />
        )}
      </div>
    </div>
  )
}

export default PersonnelReport
