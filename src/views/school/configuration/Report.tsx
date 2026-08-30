import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import ReportForm from './ReportForm'
import { Container, DimensionBadge } from './config-helper'
import { Percent, Calendar, CalendarDays } from 'lucide-react'

interface ReportData {
  minSubjectsPercentage: number
  annualSubPeriodsRequired: number
  quarterlySubPeriodsRequired: number
}

interface ReportProps {
  data?: string
}

const Report: FC<ReportProps> = ({ data }) => {
  const { t } = useTranslation()

  const reportData = useMemo<ReportData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!reportData) {
    return <ConfigurationAdd form={<ReportForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem
          title={
            t('label-minSubjectsPercentage') ||
            'Pourcentage de matière minimum nécessaire à un élève pour être classé séquentiellement'
          }
          icon={<Percent size={16} />}
        >
          <DimensionBadge>{reportData.minSubjectsPercentage}%</DimensionBadge>
        </DescriptionItem>
        <DescriptionItem
          title={
            t('label-annualSubPeriodsRequired') ||
            'Nombre de séquences requises pour être classé annuellement'
          }
          icon={<Calendar size={16} />}
        >
          <DimensionBadge>
            {reportData.annualSubPeriodsRequired}{' '}
            {reportData.annualSubPeriodsRequired === 1
              ? 'séquence'
              : 'séquences'}
          </DimensionBadge>
        </DescriptionItem>
        <DescriptionItem
          title={
            t('label-quarterlySubPeriodsRequired') ||
            'Nombre de séquences requises pour être classé trimestriellement'
          }
          icon={<CalendarDays size={16} />}
        >
          <DimensionBadge>
            {reportData.quarterlySubPeriodsRequired}{' '}
            {reportData.quarterlySubPeriodsRequired === 1
              ? 'séquence'
              : 'séquences'}
          </DimensionBadge>
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default Report
