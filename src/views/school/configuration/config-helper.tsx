import { CheckCircle2, XCircle } from 'lucide-react'
import styled from 'styled-components'

export const renderBooleanStatus = (value: boolean, t: any) => {
  // const { t } = useTranslation();
  // const isActive = Boolean(value);
  return (
    <StatusBadge $active={value}>
      {value ? (
        <>
          <CheckCircle2 size={16} />
          {t('label.yes')}
        </>
      ) : (
        <>
          <XCircle size={16} />
          {t('label.no')}
        </>
      )}
    </StatusBadge>
  )
}

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
    background: linear-gradient(135deg, rgba(40, 199, 111, 0.15) 0%, rgba(40, 199, 111, 0.08) 100%);
    color: #28c76f;
    border: 1px solid rgba(40, 199, 111, 0.2);

    svg {
      color: #28c76f;
    }

    .dark-layout & {
      background: rgba(40, 199, 111, 0.2);
      border-color: rgba(40, 199, 111, 0.3);
    }
  `
      : `
    background: linear-gradient(135deg, rgba(234, 84, 85, 0.15) 0%, rgba(234, 84, 85, 0.08) 100%);
    color: #ea5455;
    border: 1px solid rgba(234, 84, 85, 0.2);

    svg {
      color: #ea5455;
    }

    .dark-layout & {
      background: rgba(234, 84, 85, 0.2);
      border-color: rgba(234, 84, 85, 0.3);
    }
  `}
`

export const Container = styled.div`
  width: 100%;
`

export const ValueText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(115, 103, 240, 0.08);
  border-radius: 8px;
  font-weight: 500;
  color: #7367f0;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.15);
  }
`

export const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #7367f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid rgba(115, 103, 240, 0.15);

  &:first-child {
    margin-top: 0;
  }

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.25);
  }
`

export const DimensionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(0, 207, 232, 0.12) 0%,
    rgba(0, 207, 232, 0.06) 100%
  );
  border: 1px solid rgba(0, 207, 232, 0.2);
  border-radius: 8px;
  font-weight: 600;
  color: #00cfe8;
  font-size: 0.9rem;

  .dark-layout & {
    background: rgba(0, 207, 232, 0.18);
    border-color: rgba(0, 207, 232, 0.3);
  }
`

export const SignatureText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 159, 67, 0.1);
  border: 1px solid rgba(255, 159, 67, 0.2);
  border-radius: 8px;
  font-weight: 500;
  color: #ff9f43;
  font-style: italic;

  .dark-layout & {
    background: rgba(255, 159, 67, 0.15);
    border-color: rgba(255, 159, 67, 0.3);
  }
`

export const EmptyValue = styled.span`
  color: #adb5bd;
  font-style: italic;

  .dark-layout & {
    color: #6c757d;
  }
`
