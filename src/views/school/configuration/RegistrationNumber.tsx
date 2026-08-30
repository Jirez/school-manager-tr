import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import RegistrationNumberForm from './RegistrationNumberForm'
import { Container, renderBooleanStatus, ValueText } from './config-helper'
import { Hash, Minus, Type, Ruler, RotateCw, Shuffle } from 'lucide-react'

interface RegistrationNumberData {
  prefix: string
  prefixSep: string
  radicalType: string
  radicalLength: number
  radicalFill: string
  suffixLength: number
  resetNumberOrder: boolean
  randomSuffix: boolean
}

interface Props {
  data?: string
}

const RegistrationNumber: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const registrationData = useMemo<RegistrationNumberData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!registrationData) {
    return <ConfigurationAdd form={<RegistrationNumberForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem title={t('label-prefix')} icon={<Hash size={16} />}>
          <ValueText>{t(registrationData.prefix)}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-prefixSep')}
          icon={<Minus size={16} />}
        >
          <ValueText>{registrationData.prefixSep}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-radicalType')}
          icon={<Type size={16} />}
        >
          <ValueText>{t(registrationData.radicalType)}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-radicalLength')}
          icon={<Ruler size={16} />}
        >
          <ValueText>{registrationData.radicalLength}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-radicalFill')}
          icon={<Hash size={16} />}
        >
          <ValueText>{registrationData.radicalFill}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-suffixLength')}
          icon={<Ruler size={16} />}
        >
          <ValueText>{registrationData.suffixLength}</ValueText>
        </DescriptionItem>
        <DescriptionItem
          title={t('label-resetNumberOrder')}
          icon={<RotateCw size={16} />}
        >
          {renderBooleanStatus(registrationData.resetNumberOrder, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-randomSuffix')}
          icon={<Shuffle size={16} />}
        >
          {renderBooleanStatus(registrationData.randomSuffix, t)}
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default RegistrationNumber
