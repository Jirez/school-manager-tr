import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import DisciplineForm from './DisciplineForm'
import { Container, DimensionBadge } from './config-helper'
import { AlertTriangle, Gavel, CalendarDays, XCircle } from 'lucide-react'

interface DisciplineData {
  warning: number
  blame: number
  exclusion3: number
  exclusion5: number
  exclusion8: number
  definitiveExclusion: number
}

interface DisciplineProps {
  data?: string
}

const Discipline: FC<DisciplineProps> = ({ data }) => {
  const { t } = useTranslation()

  const disciplineData = useMemo<DisciplineData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!disciplineData) {
    return <ConfigurationAdd form={<DisciplineForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem
          title={t('label-warning')}
          icon={<AlertTriangle size={16} />}
        >
          <DimensionBadge>
            {disciplineData.warning}{' '}
            {disciplineData.warning === 1 ? 'jour' : 'jours'}
          </DimensionBadge>
        </DescriptionItem>
        <DescriptionItem title={t('label-blame')} icon={<Gavel size={16} />}>
          <DimensionBadge>
            {disciplineData.blame}{' '}
            {disciplineData.blame === 1 ? 'jour' : 'jours'}
          </DimensionBadge>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-exclusion3')}
          icon={<CalendarDays size={16} />}
        >
          <DimensionBadge>
            {disciplineData.exclusion3}{' '}
            {disciplineData.exclusion3 === 1 ? 'jour' : 'jours'}
          </DimensionBadge>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-exclusion5')}
          icon={<CalendarDays size={16} />}
        >
          <DimensionBadge>
            {disciplineData.exclusion5}{' '}
            {disciplineData.exclusion5 === 1 ? 'jour' : 'jours'}
          </DimensionBadge>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-exclusion8')}
          icon={<CalendarDays size={16} />}
        >
          <DimensionBadge>
            {disciplineData.exclusion8}{' '}
            {disciplineData.exclusion8 === 1 ? 'jour' : 'jours'}
          </DimensionBadge>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-definitiveExclusion')}
          icon={<XCircle size={16} />}
        >
          <DimensionBadge>
            {disciplineData.definitiveExclusion}{' '}
            {disciplineData.definitiveExclusion === 1 ? 'jour' : 'jours'}
          </DimensionBadge>
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default Discipline
