import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'
import { styled } from 'styled-components'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import LicenseWrapper from './LicenseWrapper'
import { Container, ValueText, SectionTitle } from './config-helper'
import {
  Key,
  Building2,
  Hash,
  Calendar,
  GraduationCap,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Clock, Shield } from 'react-feather'
import dayjs from 'dayjs'

const LicenseCard = styled.div`
  position: relative;
  overflow: hidden;
`

const StatusBanner = styled.div<{ $status: 'active' | 'expiring' | 'expired' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;

  ${({ $status }) => {
    switch ($status) {
      case 'active':
        return `
          background: linear-gradient(135deg, rgba(40, 199, 111, 0.15) 0%, rgba(40, 199, 111, 0.08) 100%);
          color: #28c76f;
          border: 1px solid rgba(40, 199, 111, 0.25);

          svg {
            color: #28c76f;
          }

          .dark-layout & {
            background: rgba(40, 199, 111, 0.2);
            border-color: rgba(40, 199, 111, 0.35);
          }
        `
      case 'expiring':
        return `
          background: linear-gradient(135deg, rgba(255, 159, 67, 0.15) 0%, rgba(255, 159, 67, 0.08) 100%);
          color: #ff9f43;
          border: 1px solid rgba(255, 159, 67, 0.25);

          svg {
            color: #ff9f43;
          }

          .dark-layout & {
            background: rgba(255, 159, 67, 0.2);
            border-color: rgba(255, 159, 67, 0.35);
          }
        `
      case 'expired':
        return `
          background: linear-gradient(135deg, rgba(234, 84, 85, 0.15) 0%, rgba(234, 84, 85, 0.08) 100%);
          color: #ea5455;
          border: 1px solid rgba(234, 84, 85, 0.25);

          svg {
            color: #ea5455;
          }

          .dark-layout & {
            background: rgba(234, 84, 85, 0.2);
            border-color: rgba(234, 84, 85, 0.35);
          }
        `
    }
  }}
`

const LicenseKeyDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.1) 0%,
    rgba(115, 103, 240, 0.05) 100%
  );
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: #7367f0;
  letter-spacing: 0.05em;
  word-break: break-all;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.15);
    border-color: rgba(115, 103, 240, 0.3);
  }
`

const ExpiryBadge = styled.span<{ $status: 'active' | 'expiring' | 'expired' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;

  ${({ $status }) => {
    switch ($status) {
      case 'active':
        return `
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
      case 'expiring':
        return `
          background: linear-gradient(135deg, rgba(255, 159, 67, 0.15) 0%, rgba(255, 159, 67, 0.08) 100%);
          color: #ff9f43;
          border: 1px solid rgba(255, 159, 67, 0.2);

          svg {
            color: #ff9f43;
          }

          .dark-layout & {
            background: rgba(255, 159, 67, 0.2);
            border-color: rgba(255, 159, 67, 0.3);
          }
        `
      case 'expired':
        return `
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
        `
    }
  }}
`

const DaysRemaining = styled.div`
  font-size: 0.8rem;
  margin-top: 0.25rem;
  opacity: 0.8;
`

interface LicenseData {
  licenseKey: string
  enterpriseName: string
  enterpriseId: string
  expiryDate: string
  schoolYearId: string
  subPeriods: string
}

interface LicenseProps {
  data?: string
}

const License: FC<LicenseProps> = ({ data }) => {
  const { t } = useTranslation()

  const licenseData = useMemo<LicenseData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  const licenseStatus = useMemo(() => {
    if (!licenseData?.expiryDate) return 'expired'
    const year = licenseData.expiryDate.substring(6, 10)
    const day = licenseData.expiryDate.substring(0, 2)
    const month = licenseData.expiryDate.substring(3, 5)

    const expiryDate = dayjs(`${year}-${month}-${day}`)
    const today = dayjs()
    const daysUntilExpiry = expiryDate.diff(today, 'day')

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 30) return 'expiring'
    return 'active'
  }, [licenseData])

  const daysRemaining = useMemo(() => {
    if (!licenseData?.expiryDate) return 0
    const year = licenseData.expiryDate.substring(6, 10)
    const day = licenseData.expiryDate.substring(0, 2)
    const month = licenseData.expiryDate.substring(3, 5)

    const expiryDate = dayjs(`${year}-${month}-${day}`)

    const today = dayjs()
    return expiryDate.diff(today, 'day')
  }, [licenseData])

  const getStatusMessage = () => {
    switch (licenseStatus) {
      case 'active':
        return 'Licence active'
      case 'expiring':
        return `Licence expire bientôt (${daysRemaining} jours restants)`
      case 'expired':
        return 'Licence expirée'
    }
  }

  const getStatusIcon = () => {
    switch (licenseStatus) {
      case 'active':
        return <CheckCircle2 size={20} />
      case 'expiring':
        return <AlertTriangle size={20} />
      case 'expired':
        return <AlertTriangle size={20} />
    }
  }

  if (!licenseData) {
    return <ConfigurationAdd form={<LicenseWrapper />} />
  }

  return (
    <Container>
      {/* License Status Card */}
      <LicenseCard>
        <StatusBanner $status={licenseStatus}>
          {getStatusIcon()}
          {getStatusMessage()}
        </StatusBanner>

        {/* License Details */}
        <SectionTitle>
          <Shield size={16} />
          Détails de la licence
        </SectionTitle>

        <Descriptions variant="card" layout="horizontal" columns={2} size="md">
          <DescriptionItem title="Clé" icon={<Key size={16} />} span={2}>
            <LicenseKeyDisplay>{licenseData.licenseKey}</LicenseKeyDisplay>
          </DescriptionItem>

          <DescriptionItem title="Entreprise" icon={<Building2 size={16} />}>
            <ValueText>{licenseData.enterpriseName}</ValueText>
          </DescriptionItem>

          <DescriptionItem
            title="Identifiant entreprise"
            icon={<Hash size={16} />}
          >
            <ValueText>{licenseData.enterpriseId}</ValueText>
          </DescriptionItem>

          <DescriptionItem
            title="Date d'expiration"
            icon={<Calendar size={14} />}
            span={2}
          >
            <div>
              <ExpiryBadge $status={licenseStatus}>
                {licenseStatus === 'active' && <CheckCircle2 size={16} />}
                {licenseStatus === 'expiring' && <Clock size={16} />}
                {licenseStatus === 'expired' && <AlertTriangle size={16} />}
                {licenseData.expiryDate ? licenseData.expiryDate : 'Non défini'}
              </ExpiryBadge>
              {licenseData.expiryDate && (
                <DaysRemaining>
                  {daysRemaining > 0
                    ? `${daysRemaining} jours restants`
                    : daysRemaining === 0
                      ? "Expire aujourd'hui"
                      : `Expiré depuis ${Math.abs(daysRemaining)} jours`}
                </DaysRemaining>
              )}
            </div>
          </DescriptionItem>

          <DescriptionItem
            title="Année scolaire"
            icon={<GraduationCap size={16} />}
          >
            <ValueText>{licenseData.schoolYearId}</ValueText>
          </DescriptionItem>
          <DescriptionItem
            title="Séquences autorisées"
            icon={<CalendarDays size={16} />}
          >
            <ValueText>{licenseData.subPeriods}</ValueText>
          </DescriptionItem>
        </Descriptions>
      </LicenseCard>
    </Container>
  )
}

export default License
