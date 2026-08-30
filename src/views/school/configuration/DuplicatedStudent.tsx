import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import DuplicatedStudentForm from './DuplicatedStudentForm'
import { Container, renderBooleanStatus } from './config-helper'
import { ShieldCheck, User, Calendar, MapPin, Users } from 'lucide-react'

interface DuplicatedStudentData {
  verifyDuplicatedStudent: boolean
  includeLastName: boolean
  includeFirstName: boolean
  includeBirthDate: boolean
  includeBirthplace: boolean
  includeGender: boolean
}

interface Props {
  data?: string
}

const DuplicatedStudent: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const duplicatedData = useMemo<DuplicatedStudentData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!duplicatedData) {
    return <ConfigurationAdd form={<DuplicatedStudentForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem
          title={t('label-verifyDuplicatedStudent')}
          icon={<ShieldCheck size={16} />}
        >
          {renderBooleanStatus(duplicatedData.verifyDuplicatedStudent, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-includeLastName')}
          icon={<User size={16} />}
        >
          {renderBooleanStatus(duplicatedData.includeLastName, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-includeFirstName')}
          icon={<User size={16} />}
        >
          {renderBooleanStatus(duplicatedData.includeFirstName, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-includeBirthDate')}
          icon={<Calendar size={16} />}
        >
          {renderBooleanStatus(duplicatedData.includeBirthDate, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-includeBirthplace')}
          icon={<MapPin size={16} />}
        >
          {renderBooleanStatus(duplicatedData.includeBirthplace, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-includeGender')}
          icon={<Users size={16} />}
        >
          {renderBooleanStatus(duplicatedData.includeGender, t)}
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default DuplicatedStudent
