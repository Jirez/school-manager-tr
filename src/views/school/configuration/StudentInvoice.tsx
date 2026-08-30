import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import StudentInvoiceForm from './StudentInvoiceForm'
import {
  Container,
  renderBooleanStatus,
  ValueText,
  DimensionBadge,
} from './config-helper'
import { Hash, Type, Ruler, RotateCw, FileCheck } from 'lucide-react'

interface StudentInvoiceData {
  prefix: string
  radical: string
  suffixLength: number
  resetNumberOrder: boolean
  compulsory: boolean
}

interface Props {
  data?: string
}

const StudentInvoice: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const invoiceData = useMemo<StudentInvoiceData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  const radicalTranslation = useMemo(() => {
    if (!invoiceData?.radical) return ''
    return t(invoiceData.radical)
  }, [invoiceData?.radical, t])

  return (
    <>
      {!invoiceData ? (
        <ConfigurationAdd form={<StudentInvoiceForm />} />
      ) : (
        <Container>
          <Descriptions
            variant="card"
            layout="horizontal"
            columns={2}
            size="md"
          >
            <DescriptionItem
              title={t('label-prefix')}
              icon={<Hash size={16} />}
            >
              <ValueText>{invoiceData.prefix}</ValueText>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-radicalType')}
              icon={<Type size={16} />}
            >
              <ValueText>{radicalTranslation}</ValueText>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-suffixLength')}
              icon={<Ruler size={16} />}
            >
              <DimensionBadge>{invoiceData.suffixLength}</DimensionBadge>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-resetNumberOrder')}
              icon={<RotateCw size={16} />}
            >
              {renderBooleanStatus(invoiceData.resetNumberOrder, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-invoiceIsCompulsory')}
              icon={<FileCheck size={16} />}
            >
              {renderBooleanStatus(invoiceData.compulsory, t)}
            </DescriptionItem>
          </Descriptions>
        </Container>
      )}
    </>
  )
}

export default StudentInvoice
