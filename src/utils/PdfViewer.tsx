import { useState, useEffect, useCallback, useRef } from 'react'
import type { FC } from 'react'
import { toast } from 'react-toastify'
import {
  Download,
  FileText,
  AlertCircle,
  ExternalLink,
  Printer,
  Maximize,
  Minimize,
  RefreshCw,
} from 'lucide-react'
import { useTranslation, getI18n } from 'react-i18next'
import styled, { keyframes, css } from 'styled-components'
import { useFullscreen } from 'ahooks'

import RestDataSource from './RestDataSource'
import Button from '@/@core/components/button'
import { m } from '@/paraglide/messages'

// Wrapper card for the entire PDF viewer
const ViewerWrapper = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 12px;
  box-shadow:
    0 2px 12px rgba(115, 103, 240, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.98) 0%,
      rgba(40, 48, 70, 0.95) 100%
    );
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow:
      0 4px 15px rgba(0, 0, 0, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1);
  }
`

const ViewerContainer = styled.div<{ $isFullscreen?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 700px;
  background: transparent;
  transition: all 0.3s ease;

  ${({ $isFullscreen }) =>
    $isFullscreen &&
    css`
      background: #f8f9fa;
      padding: 1rem;
      height: 100vh;
      overflow: hidden;

      .dark-layout & {
        background: #1e2538;
      }
    `}
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.08) 0%,
    rgba(115, 103, 240, 0.04) 100%
  );
  border-bottom: 1px solid rgba(115, 103, 240, 0.12);
  backdrop-filter: blur(10px);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.15) 0%,
      rgba(115, 103, 240, 0.08) 100%
    );
    border-bottom-color: rgba(115, 103, 240, 0.25);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 1rem;
  }
`

const ToolbarTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const TitleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.25);

  svg {
    color: white;
  }
`

const TitleText = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: #2c3e50;
  letter-spacing: -0.01em;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-end;
  }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const StyledObject = styled.object<{ $isFullscreen?: boolean }>`
  width: 100%;
  height: ${({ $isFullscreen }) => ($isFullscreen ? '100%' : '750px')};
  border: none;
  background: #ffffff;
  animation: ${fadeIn} 0.5s ease-out forwards;
  flex: 1;

  .dark-layout & {
    background: #1e2538;
  }
`

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #ea5455;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(234, 84, 85, 0.04) 0%,
    rgba(234, 84, 85, 0.02) 100%
  );
  border-radius: 12px;
  border: 1px dashed rgba(234, 84, 85, 0.25);
  margin: 1rem;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(234, 84, 85, 0.2));
  }

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #ea5455;
  }

  p {
    margin: 1rem 0 2rem 0;
    font-size: 1rem;
    opacity: 0.85;
    max-width: 420px;
    line-height: 1.6;
    color: #6c757d;

    .dark-layout & {
      color: #9ca3af;
    }
  }
`

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`

const SkeletonBlock = styled.div<{
  $width?: string
  $height?: string
  $radius?: string
}>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '1rem' }) => $height};
  flex-shrink: 0;
  border-radius: ${({ $radius = '6px' }) => $radius};
  background: linear-gradient(
    90deg,
    rgba(115, 103, 240, 0.08) 25%,
    rgba(115, 103, 240, 0.18) 50%,
    rgba(115, 103, 240, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;

  .dark-layout & {
    background: linear-gradient(
      90deg,
      rgba(167, 139, 250, 0.12) 25%,
      rgba(167, 139, 250, 0.25) 50%,
      rgba(167, 139, 250, 0.12) 75%
    );
    background-size: 200% 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const LoadingPlaceholder = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(115, 103, 240, 0.1);
  background: #ffffff;

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const LoadingToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.08) 0%,
    rgba(115, 103, 240, 0.04) 100%
  );
  border-bottom: 1px solid rgba(115, 103, 240, 0.12);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.15) 0%,
      rgba(115, 103, 240, 0.08) 100%
    );
    border-bottom-color: rgba(115, 103, 240, 0.25);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }
`

const LoadingToolbarTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const LoadingToolbarActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 640px) {
    justify-content: flex-end;
  }
`

const LoadingDocument = styled.div<{ $height: number | string }>`
  display: grid;
  place-items: center;
  height: ${({ $height }) =>
    typeof $height === 'number' ? `${$height}px` : $height};
  min-height: 400px;
  padding: 1rem;
  overflow: hidden;
  background: #f3f4f6;

  .dark-layout & {
    background: #1e2538;
  }

  @media (max-width: 576px) {
    padding: 0.75rem;
  }
`

const LoadingPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: min(70%, 620px);
  max-height: 100%;
  aspect-ratio: 0.707;
  padding: 8%;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);

  .dark-layout & {
    background: #283046;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 576px) {
    width: 82%;
    gap: 1rem;
    padding: 7%;
  }
`

const LoadingPageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const LoadingPageRows = styled.div`
  display: grid;
  gap: 0.6rem;
`

const ActionButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &.btn-outline-secondary {
    color: #5e5873 !important;
    border-color: #d8d6de !important;
    background: transparent !important;

    &:hover {
      background-color: rgba(115, 103, 240, 0.08) !important;
      border-color: #7367f0 !important;
      color: #7367f0 !important;
      transform: translateY(-1px);
    }

    .dark-layout & {
      color: #b4b7bd !important;
      border-color: #404656 !important;

      &:hover {
        background-color: rgba(115, 103, 240, 0.15) !important;
        border-color: #7367f0 !important;
        color: #9e95f5 !important;
      }
    }
  }

  &.btn-primary {
    background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%) !important;
    border: none !important;
    box-shadow: 0 3px 10px rgba(115, 103, 240, 0.35);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(115, 103, 240, 0.45);
    }
  }
`

const IconButton = styled(ActionButton)`
  padding: 0.4rem;
  min-width: 32px;

  @media (min-width: 768px) {
    padding: 0.4rem 0.75rem;
    min-width: auto;
  }
`

const ButtonDivider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(115, 103, 240, 0.1);
  margin: 0 0.25rem;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.25);
  }
`

interface PdfViewerProps {
  url: string
  showDownload?: boolean
  title?: string
  height?: number | string
}

const PdfViewer: FC<PdfViewerProps> = ({
  url,
  showDownload = true,
  title,
  height = 600,
}) => {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(containerRef)

  const { t } = useTranslation()

  const buildReport = useCallback(
    (locale?: string) => {
      setLoading(true)
      setError(null)

      const dataSource = new RestDataSource(locale)
      dataSource
        .getPdf(url, (data: any) => {
          const blobUrl = window.URL.createObjectURL(
            new Blob([data], { type: 'application/pdf' }),
          )
          setReportData(blobUrl)
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
          setReportData(null)
          const errorMessage =
            err.response?.data?.message ||
            t(
              'error-rendering-document',
              'Une erreur est survenue durant le rendu du document',
            )
          setError(errorMessage)
          toast.error(errorMessage)
        })
    },
    [url, t],
  )

  useEffect(() => {
    const locale = getI18n().language
    buildReport(locale)

    return () => {
      if (reportData) {
        window.URL.revokeObjectURL(reportData)
      }
    }
  }, [url])

  const handleDownload = () => {
    if (!reportData) return
    const a = document.createElement('a')
    a.href = reportData
    const fileName = url.split('/').pop()?.split('?')[0] || 'report.pdf'
    a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
    a.click()
  }

  const handlePrint = () => {
    if (!reportData) return
    const printWindow = window.open(reportData)
    if (printWindow) {
      printWindow.addEventListener(
        'load',
        () => {
          printWindow.print()
        },
        true,
      )
    }
  }

  const handleOpenNewTab = () => {
    if (reportData) {
      window.open(reportData, '_blank')
    }
  }

  const handleRefresh = () => {
    const locale = getI18n().language
    buildReport(locale)
  }

  if (loading) {
    return (
      <ViewerWrapper
        aria-busy="true"
        aria-label={m.label_generatingReport()}
        role="status"
      >
        <LoadingPlaceholder aria-hidden="true">
          <LoadingToolbar>
            <LoadingToolbarTitle>
              <SkeletonBlock $width="2rem" $height="2rem" $radius="8px" />
              <SkeletonBlock $width="10rem" $height="1rem" />
            </LoadingToolbarTitle>
            <LoadingToolbarActions>
              <SkeletonBlock $width="2rem" $height="2rem" $radius="6px" />
              <SkeletonBlock $width="2rem" $height="2rem" $radius="6px" />
              <ButtonDivider />
              <SkeletonBlock $width="2rem" $height="2rem" $radius="6px" />
              <SkeletonBlock $width="2rem" $height="2rem" $radius="6px" />
              {showDownload && (
                <SkeletonBlock $width="6rem" $height="2rem" $radius="6px" />
              )}
            </LoadingToolbarActions>
          </LoadingToolbar>
          <LoadingDocument $height={height}>
            <LoadingPage>
              <SkeletonBlock $width="42%" $height="0.75rem" />
              <SkeletonBlock $width="78%" $height="1.25rem" />
              <LoadingPageContent>
                <SkeletonBlock $width="62%" $height="0.85rem" />
                <LoadingPageRows>
                  {[0, 1, 2, 3].map((row) => (
                    <SkeletonBlock
                      key={row}
                      $width={`${92 - (row % 2) * 12}%`}
                      $height="0.5rem"
                    />
                  ))}
                </LoadingPageRows>
              </LoadingPageContent>
              <SkeletonBlock $width="50%" $height="0.85rem" />
              <LoadingPageRows>
                {[0, 1, 2, 3, 4, 5].map((row) => (
                  <SkeletonBlock
                    key={row}
                    $width={`${96 - (row % 3) * 10}%`}
                    $height="0.5rem"
                  />
                ))}
              </LoadingPageRows>
            </LoadingPage>
          </LoadingDocument>
        </LoadingPlaceholder>
      </ViewerWrapper>
    )
  }

  if (error || !reportData) {
    return (
      <ViewerWrapper>
        <ErrorState>
          <AlertCircle strokeWidth={1.5} />
          <h3>{t('label-renderingError', 'Erreur de rendu')}</h3>
          <p>
            {error ||
              t(
                'label-renderingErrorDesc',
                "Désolé, nous n'avons pas pu générer le document PDF pour le moment.",
              )}
          </p>
          <ActionButton
            color="primary"
            onClick={() => buildReport(getI18n().language)}
          >
            <RefreshCw size={16} />
            {m.label_retry()}
          </ActionButton>
        </ErrorState>
      </ViewerWrapper>
    )
  }

  return (
    <ViewerWrapper>
      <ViewerContainer ref={containerRef} $isFullscreen={isFullscreen}>
        <Toolbar>
          <ToolbarTitle>
            <TitleIcon>
              <FileText size={18} strokeWidth={2} />
            </TitleIcon>
            <TitleText>
              {title || t('label-documentPreview', 'Aperçu du document')}
            </TitleText>
          </ToolbarTitle>
          <ToolbarActions>
            <IconButton
              outline
              color="secondary"
              onClick={handleRefresh}
              title={t('label-refresh', 'Actualiser')}
            >
              <RefreshCw size={14} />
              <span className="d-none d-lg-inline">{m.label_refresh()}</span>
            </IconButton>
            <IconButton
              outline
              color="secondary"
              onClick={toggleFullscreen}
              title={
                isFullscreen ? m.label_exitFullscreen() : m.label_fullscreen()
              }
            >
              {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              <span className="d-none d-lg-inline">
                {isFullscreen ? m.label_exitFullscreen() : m.label_fullscreen()}
              </span>
            </IconButton>

            <ButtonDivider />

            <IconButton
              outline
              color="secondary"
              onClick={handleOpenNewTab}
              title={m.label_open()}
            >
              <ExternalLink size={14} />
              <span className="d-none d-lg-inline">{m.label_open()}</span>
            </IconButton>
            <IconButton
              outline
              color="secondary"
              onClick={handlePrint}
              title={m.label_print()}
            >
              <Printer size={14} />
              <span className="d-none d-lg-inline">{m.label_print()}</span>
            </IconButton>
            {showDownload && (
              <ActionButton color="primary" onClick={handleDownload}>
                <Download size={14} />
                <span>{m.label_download()}</span>
              </ActionButton>
            )}
          </ToolbarActions>
        </Toolbar>
        <StyledObject
          data={reportData}
          type="application/pdf"
          $isFullscreen={isFullscreen}
          style={!isFullscreen ? { height } : undefined}
          title="PDF Preview"
        >
          <ErrorState>
            <AlertCircle strokeWidth={1.5} />
            <p>
              {t(
                'label-pdfNotSupported',
                "Votre navigateur ne supporte pas l'affichage direct des PDF.",
              )}
            </p>
            <ActionButton color="primary" onClick={handleDownload}>
              <Download size={14} />
              {t('label-downloadToView', 'Télécharger pour voir')}
            </ActionButton>
          </ErrorState>
        </StyledObject>
      </ViewerContainer>
    </ViewerWrapper>
  )
}

export default PdfViewer
