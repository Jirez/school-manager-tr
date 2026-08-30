import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { useMemo } from 'react'

import { DescriptionItem, Descriptions } from '@/@core/components/description'
import ConfigurationAdd from './ConfigurationAdd'
import StudentPaymentConfigForm from './StudentPaymentConfigForm'
import {
  Container,
  renderBooleanStatus,
  ValueText,
  DimensionBadge,
  SignatureText,
} from './config-helper'
import {
  Hash,
  Type,
  Ruler,
  RotateCw,
  Users,
  School,
  FileCheck,
  Receipt,
  AlignLeft,
  Minus,
  AlignRight,
  Eye,
  ArrowRightLeft,
} from 'lucide-react'

interface StudentPaymentConfigData {
  prefix: string
  radical: string
  suffixLength: number
  resetNumberOrder: boolean
  paymentGroupCompulsory: boolean
  schoolFeeCompulsory: boolean
  uniqueInvoice: boolean
  bigSizeReceipt: boolean
  leftSignature: string
  middleSignature: string
  rightSignature: string
  showEmptyNonCompulsory: boolean
  forceClassChange: boolean
}

interface Props {
  data?: string
}

const StudentPaymentConfig: FC<Props> = ({ data }) => {
  const { t } = useTranslation()

  const paymentData = useMemo<StudentPaymentConfigData | null>(() => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [data])

  const radicalTranslation = useMemo(() => {
    if (!paymentData?.radical) return ''
    return t(paymentData.radical)
  }, [paymentData?.radical, t])

  return (
    <>
      {!paymentData ? (
        <ConfigurationAdd form={<StudentPaymentConfigForm />} />
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
              <ValueText>{paymentData.prefix}</ValueText>
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
              <DimensionBadge>{paymentData.suffixLength}</DimensionBadge>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-resetNumberOrder')}
              icon={<RotateCw size={16} />}
            >
              {renderBooleanStatus(paymentData.resetNumberOrder, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-paymentGroupCompulsory')}
              icon={<Users size={16} />}
            >
              {renderBooleanStatus(paymentData.paymentGroupCompulsory, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-schoolFeeCompulsory')}
              icon={<School size={16} />}
            >
              {renderBooleanStatus(paymentData.schoolFeeCompulsory, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-uniqueInvoice')}
              icon={<FileCheck size={16} />}
            >
              {renderBooleanStatus(paymentData.uniqueInvoice, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-bigSizeReceipt')}
              icon={<Receipt size={16} />}
            >
              {renderBooleanStatus(paymentData.bigSizeReceipt, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-leftSignature')}
              icon={<AlignLeft size={16} />}
            >
              <SignatureText>{paymentData.leftSignature || '—'}</SignatureText>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-middleSignature')}
              icon={<Minus size={16} />}
            >
              <SignatureText>
                {paymentData.middleSignature || '—'}
              </SignatureText>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-rightSignature')}
              icon={<AlignRight size={16} />}
            >
              <SignatureText>{paymentData.rightSignature || '—'}</SignatureText>
            </DescriptionItem>
            <DescriptionItem
              title={t('label-showEmptyNonCompulsory')}
              icon={<Eye size={16} />}
            >
              {renderBooleanStatus(paymentData.showEmptyNonCompulsory, t)}
            </DescriptionItem>
            <DescriptionItem
              title={t('label-forceClassChange')}
              icon={<ArrowRightLeft size={16} />}
            >
              {renderBooleanStatus(paymentData.forceClassChange, t)}
            </DescriptionItem>
          </Descriptions>
        </Container>
      )}
    </>
  )
}

export default StudentPaymentConfig
