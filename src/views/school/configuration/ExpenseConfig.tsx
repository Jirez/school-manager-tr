import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import ExpenseConfigForm from './ExpenseConfigForm'
import { Container, renderBooleanStatus } from './config-helper'
import { Receipt } from 'lucide-react'

interface ExpenseConfigData {
  voucherCompulsory: boolean
}

interface Props {
  data?: string
}

const ExpenseConfig: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const expenseData = useMemo<ExpenseConfigData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!expenseData) {
    return <ConfigurationAdd form={<ExpenseConfigForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={1} size="md">
        <DescriptionItem
          title={t('label-voucherCompulsory')}
          icon={<Receipt size={16} />}
        >
          {renderBooleanStatus(expenseData.voucherCompulsory, t)}
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default ExpenseConfig
