import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import PictureForm from './PictureForm'
import { Container, ValueText } from './config-helper'
import { Folder } from 'lucide-react'

interface PictureData {
  picturePath: string
}

interface Props {
  data?: string
}

const Picture: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const pictureData = useMemo<PictureData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  if (!pictureData) {
    return <ConfigurationAdd form={<PictureForm />} />
  }

  return (
    <Container>
      <Descriptions variant="card" layout="horizontal" columns={1} size="md">
        <DescriptionItem
          title={t('label-picturePath')}
          icon={<Folder size={16} />}
        >
          <ValueText>{pictureData.picturePath}</ValueText>
        </DescriptionItem>
      </Descriptions>
    </Container>
  )
}

export default Picture
