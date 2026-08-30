import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import PersonnelCodeForm from './PersonnelCodeForm'
import { Container, renderBooleanStatus, ValueText } from './config-helper'
import { Hash, Minus, Type, Ruler, Plus, RotateCw, Shuffle } from 'lucide-react'

interface PersonnelCodeData {
  prefix: string
  prefixSep: string
  radicalType: string
  radicalLength: number
  radicalFill: string
  postRadical: string
  suffixLength: number
  resetNumberOrder: boolean
  randomSuffix: boolean
}

interface Props {
  data?: string
}

const PersonnelCode: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const personnelData = useMemo<PersonnelCodeData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!personnelData) {
    return <ConfigurationAdd form={<PersonnelCodeForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem title={t('label-prefix')} icon={<Hash size={16} />}>
          <ValueText>{t(personnelData.prefix)}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-prefixSep')}
          icon={<Minus size={16} />}
        >
          <ValueText>{personnelData.prefixSep}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-radicalType')}
          icon={<Type size={16} />}
        >
          <ValueText>{t(personnelData.radicalType)}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-radicalLength')}
          icon={<Ruler size={16} />}
        >
          <ValueText>{personnelData.radicalLength}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-radicalFill')}
          icon={<Hash size={16} />}
        >
          <ValueText>{personnelData.radicalFill}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-postRadical')}
          icon={<Plus size={16} />}
        >
          <ValueText>{personnelData.postRadical}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-suffixLength')}
          icon={<Ruler size={16} />}
        >
          <ValueText>{personnelData.suffixLength}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-resetNumberOrder')}
          icon={<RotateCw size={16} />}
        >
          {renderBooleanStatus(personnelData.resetNumberOrder, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-randomSuffix')}
          icon={<Shuffle size={16} />}
        >
          {renderBooleanStatus(personnelData.randomSuffix, t)}
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default PersonnelCode
