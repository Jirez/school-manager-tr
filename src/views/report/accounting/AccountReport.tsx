import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'
import { Settings, FileText } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import PdfViewer from '@/utils/PdfViewer'
import PageHeader from '@/@core/components/ui/page-header'
import { useSearch } from '../useReportSearch'
import CustomReportModal from '../CustomReportModal'
import ReportOptions from '../ReportOptions'
import {
  ActionButtonsContainer,
  StyledButton,
  PdfContainer,
  EmptyState,
} from '../report.style'

const AccountReport = () => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    setValues,
    params,
    values: currentValues,
    show,
  } = useSearch({
    title: t('label-accountReport'),
    orientation: 'PORTRAIT',
    columnBorder: true,
    rowNumber: true,
    pageType: 'A4',
  })
  const modal = useModal(CustomReportModal)

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader title={t('label-accountReport')} returnLink="/reports" />
      </div>

      <ReportOptions>
        <ActionButtonsContainer>
          <StyledButton
            type="button"
            color="secondary"
            className="round h-10"
            onClick={() =>
              modal.show({ options: { ...currentValues }, setValues })
            }
          >
            <Settings size={16} />
            {t('label-customizeReport')}
          </StyledButton>
          {/* <ExportButton
            as="a"
            href={`${BASE_REPORT_URL}/reports/account-list-${enterpriseId}.xlsx?search=enterprise:${enterpriseId}&params=${params}`}
            className="round h-10 px-1"
          >
            <FileSpreadsheet size={16} />
            {t("label-exportToExcel")}
          </ExportButton> */}
        </ActionButtonsContainer>
      </ReportOptions>

      <PdfContainer>
        {show ? (
          <PdfViewer
            url={`reports/account-list-${enterpriseId}.pdf?search=enterprise:${enterpriseId}&params=${params}`}
          />
        ) : (
          <EmptyState>
            <FileText />
            <p>
              {t('label-clickExecuteReportToView') ||
                "Cliquez sur 'Exécuter le rapport' pour voir le rapport des comptes"}
            </p>
          </EmptyState>
        )}
      </PdfContainer>
    </div>
  )
}

export default AccountReport
