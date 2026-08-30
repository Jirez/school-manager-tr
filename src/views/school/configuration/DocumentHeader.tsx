import { DescriptionItem, Descriptions } from '@/@core/components/description'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import ConfigurationAdd from './ConfigurationAdd'
import DocumentHeaderForm from './DocumentHeaderForm'
import { styled } from 'styled-components'
import { AlertCircle, AlignLeft, AlignRight, Eye, FileText } from 'lucide-react'
import { Container, SectionTitle } from './config-helper'

const PreviewSection = styled.div`
  margin-bottom: 1.5rem;
`

const PreviewCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.05) 0%,
    rgba(115, 103, 240, 0.02) 100%
  );
  border: 2px dashed rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.08);
    border-color: rgba(115, 103, 240, 0.3);
  }
`

const PreviewLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  top: -12px;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  background: #7367f0;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;

  svg {
    color: #ffffff;
  }
`

const PreviewContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  min-height: 80px;
  padding-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`

const HeaderBlock = styled.div<{ $align: 'left' | 'right' }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) =>
    $align === 'left' ? 'flex-start' : 'flex-end'};
  text-align: ${({ $align }) => $align};
`

const HeaderLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6c757d;
  margin-bottom: 0.5rem;

  svg {
    color: #7367f0;
  }

  .dark-layout & {
    color: #9ca3af;
  }
`

const HeaderText = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.6;
  white-space: pre-wrap;
  max-width: 300px;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const Divider = styled.div`
  width: 1px;
  min-height: 60px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(115, 103, 240, 0.3) 50%,
    transparent 100%
  );

  @media (max-width: 768px) {
    width: 100%;
    height: 1px;
    min-height: auto;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(115, 103, 240, 0.3) 50%,
      transparent 100%
    );
  }
`

const ErrorText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ea5455;
  font-size: 0.85rem;
  font-style: italic;

  svg {
    flex-shrink: 0;
  }
`

const EmptyText = styled.span`
  color: #adb5bd;
  font-style: italic;

  .dark-layout & {
    color: #6c757d;
  }
`

const HeaderValueBox = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(115, 103, 240, 0.06);
  border: 1px solid rgba(115, 103, 240, 0.15);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.12);
    border-color: rgba(115, 103, 240, 0.25);
    color: #e4e6eb;
  }
`

interface DocumentHeaderData {
  leftHeader?: string
  rightHeader?: string
}

interface DocumentHeaderProps {
  data: string
}

const DocumentHeader: FC<DocumentHeaderProps> = ({ data }) => {
  const { t } = useTranslation()

  const headerData = useMemo<DocumentHeaderData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  const parseError = useMemo(() => {
    if (!data) return false
    try {
      JSON.parse(data)
      return false
    } catch {
      return true
    }
  }, [data])

  const renderHeaderValue = (value: string | undefined) => {
    if (parseError) {
      return (
        <ErrorText>
          <AlertCircle size={16} />
          Erreur dans le fichier de configuration
        </ErrorText>
      )
    }
    if (!value) {
      return <EmptyText>Non défini</EmptyText>
    }
    return <HeaderValueBox>{value}</HeaderValueBox>
  }

  if (!data) {
    return <ConfigurationAdd form={<DocumentHeaderForm />} />
  }

  return (
    <Container>
      {/* Preview Section */}
      <PreviewSection>
        <PreviewCard>
          <PreviewLabel>
            <Eye size={12} />
            Aperçu
          </PreviewLabel>
          <PreviewContent>
            <HeaderBlock $align="left">
              <HeaderLabel>
                <AlignLeft size={12} />
                Gauche
              </HeaderLabel>
              <HeaderText>
                {parseError ? (
                  <ErrorText>
                    <AlertCircle size={14} />
                    Erreur
                  </ErrorText>
                ) : headerData?.leftHeader ? (
                  headerData.leftHeader
                ) : (
                  <EmptyText>—</EmptyText>
                )}
              </HeaderText>
            </HeaderBlock>

            <Divider />

            <HeaderBlock $align="right">
              <HeaderLabel>
                <AlignRight size={12} />
                Droite
              </HeaderLabel>
              <HeaderText>
                {parseError ? (
                  <ErrorText>
                    <AlertCircle size={14} />
                    Erreur
                  </ErrorText>
                ) : headerData?.rightHeader ? (
                  headerData.rightHeader
                ) : (
                  <EmptyText>—</EmptyText>
                )}
              </HeaderText>
            </HeaderBlock>
          </PreviewContent>
        </PreviewCard>
      </PreviewSection>

      {/* Details Section */}
      <SectionTitle>
        <FileText size={16} />
        Détails de l'en-tête
      </SectionTitle>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem
          title={t('label-leftHeader')}
          icon={<AlignLeft size={14} />}
        >
          {renderHeaderValue(headerData?.leftHeader)}
        </DescriptionItem>

        <DescriptionItem
          title={t('label-rightHeader')}
          icon={<AlignRight size={14} />}
        >
          {renderHeaderValue(headerData?.rightHeader)}
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default DocumentHeader
