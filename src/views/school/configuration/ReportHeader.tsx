import { DescriptionItem, Descriptions } from '@/@core/components/description'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import ConfigurationAdd from './ConfigurationAdd'
import ReportHeaderForm from './ReportHeaderForm'

interface DocumentHeaderProps {
  data: string
}

const ReportHeader: FC<DocumentHeaderProps> = (props) => {
  const { t } = useTranslation()

  const getLeftHeader = () => {
    try {
      return JSON.parse(props.data).leftHeader
    } catch (e) {
      return 'Error in configuration file'
    }
  }

  const getRightHeader = () => {
    try {
      return JSON.parse(props.data).rightHeader
    } catch (e) {
      return 'Error in configuration file'
    }
  }

  return props.data ? (
    <Descriptions layout="vertical">
      <DescriptionItem title={t('label-leftHeader')}>
        {getLeftHeader()}
      </DescriptionItem>
      <DescriptionItem title={t('label-rightHeader')}>
        {getRightHeader()}
      </DescriptionItem>
    </Descriptions>
  ) : (
    <ConfigurationAdd form={<ReportHeaderForm />} />
  )
}

export default ReportHeader
