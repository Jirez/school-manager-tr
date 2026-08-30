import PageHeader from '@/@core/components/ui/page-header'
import Scrollbar from '@/@core/components/ui/scrollbar'
import { ANNUAL_DISCIPLINE, QUARTERLY_DISCIPLINE } from '@/utils/constants'
import { useTitle } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Calendar, Award } from 'lucide-react'
import { styled } from 'styled-components'

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const DisciplineCard = styled(Link)<{ $variant: 'quarterly' | 'annual' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem;
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 220px;

  ${({ $variant }) => {
    if ($variant === 'quarterly') {
      return `
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.08) 100%);
        border: 2px solid rgba(59, 130, 246, 0.25);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);

        &:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
        }

        .dark-layout & {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.12) 100%);
          border-color: rgba(59, 130, 246, 0.35);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

          &:hover {
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }
        }
      `
    } else {
      return `
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.08) 100%);
        border: 2px solid rgba(239, 68, 68, 0.25);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);

        &:hover {
          transform: translateY(-4px);
          border-color: rgba(239, 68, 68, 0.4);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.25);
        }

        .dark-layout & {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.12) 100%);
          border-color: rgba(239, 68, 68, 0.35);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);

          &:hover {
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
          }
        }
      `
    }
  }}

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      ${({ $variant }) =>
        $variant === 'quarterly'
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(239, 68, 68, 0.1)'}
        0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`

const IconWrapper = styled.div<{ $variant: 'quarterly' | 'annual' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;

  ${({ $variant }) => {
    if ($variant === 'quarterly') {
      return `
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

        svg {
          color: #3b82f6;
          filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4));
        }

        .dark-layout & {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);

          svg {
            color: #60a5fa;
          }
        }
      `
    } else {
      return `
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

        svg {
          color: #ef4444;
          filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.4));
        }

        .dark-layout & {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.2) 100%);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);

          svg {
            color: #f87171;
          }
        }
      `
    }
  }}

  ${DisciplineCard}:hover & {
    transform: scale(1.1);
    transition: transform 0.3s ease;
  }
`

const CardTitle = styled.h3<{ $variant: 'quarterly' | 'annual' }>`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  position: relative;
  z-index: 1;

  ${({ $variant }) => {
    if ($variant === 'quarterly') {
      return `
        color: #1e40af;
        text-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

        .dark-layout & {
          color: #93c5fd;
        }
      `
    } else {
      return `
        color: #991b1b;
        text-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);

        .dark-layout & {
          color: #fca5a5;
        }
      `
    }
  }}
`

const CardDescription = styled.p`
  margin: 0.75rem 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  position: relative;
  z-index: 1;

  .dark-layout & {
    color: #9ca3af;
  }
`

const DisciplineCalculation = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.disciplineCalculation'))

  return (
    <Scrollbar className="flex flex-col w-full">
      <div className="w-full mb-6">
        <PageHeader title={t('sidebar.marks.disciplineCalculation')} />
      </div>
      <CardContainer>
        <DisciplineCard to={QUARTERLY_DISCIPLINE} $variant="quarterly">
          <IconWrapper $variant="quarterly">
            <Calendar size={40} />
          </IconWrapper>
          <CardTitle $variant="quarterly">
            {t('label-quarterlyDiscipline')}
          </CardTitle>
          <CardDescription>
            {t('label-quarterlyDisciplineDescription') ||
              'Calcul de la discipline trimestrielle'}
          </CardDescription>
        </DisciplineCard>

        <DisciplineCard to={ANNUAL_DISCIPLINE} $variant="annual">
          <IconWrapper $variant="annual">
            <Award size={40} />
          </IconWrapper>
          <CardTitle $variant="annual">{t('label-annualDiscipline')}</CardTitle>
          <CardDescription>
            {t('label-annualDisciplineDescription') ||
              'Calcul de la discipline annuelle'}
          </CardDescription>
        </DisciplineCard>
      </CardContainer>
    </Scrollbar>
  )
}

export default DisciplineCalculation
