import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import SecurityForm from './SecurityForm'
import { Container, renderBooleanStatus, ValueText } from './config-helper'
import { Shield, Lock } from 'lucide-react'

interface SecurityData {
  enableSecuredLogin: boolean
  type: string
}

interface SecurityProps {
  data?: string
}

const Security: FC<SecurityProps> = ({ data }) => {
  const { t } = useTranslation()

  const securityData = useMemo<SecurityData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  const loginTypeTranslation = useMemo(() => {
    if (!securityData?.type) return ''
    const translationKey = `${securityData.type}_LOGIN`
    return t(translationKey)
  }, [securityData?.type, t])

  if (!securityData) {
    return <ConfigurationAdd form={<SecurityForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={2} size="md">
        <DescriptionItem
          title={t('label-enableSecuredLogin')}
          icon={<Shield size={16} />}
        >
          {renderBooleanStatus(securityData.enableSecuredLogin, t)}
        </DescriptionItem>
        <DescriptionItem
          title={t('label-loginSecurityType')}
          icon={<Lock size={16} />}
        >
          <ValueText>{loginTypeTranslation}</ValueText>
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default Security
