import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeStudentPaymentDocument } from '@/gql/graphql'
import { useLocalStorageState } from 'ahooks'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
  SwitchWrapper,
} from './config-form-helper'
import { Hash, AlignLeft, Eye, CreditCard } from 'lucide-react'

interface StudentPaymentType {
  prefix: string
  radical:
    'SHORT_YEAR' | 'FULL_YEAR' | 'FULL_YEAR_MONTH_DAY' | 'SHORT_YEAR_MONTH_DAY'
  suffixLength: number
  resetNumberOrder: boolean
  paymentGroupCompulsory: boolean
  schoolFeeCompulsory: boolean
  uniqueInvoice: boolean
  bigSizeReceipt: boolean
  leftSignature: string
  rightSignature: string
  middleSignature: string
  showEmptyNonCompulsory: boolean
  forceClassChange: boolean
}

interface Props {
  studentPayment?: StudentPaymentType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const StudentPaymentConfigForm: FC<Props> = ({
  studentPayment,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()
  const [_, setSchoolFeeCompulsory] = useLocalStorageState<boolean>(
    'schoolFeeCompulsory',
    {
      defaultValue: false,
    },
  )

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeStudentPaymentDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    getValues,
  } = useForm<StudentPaymentType>({
    defaultValues: {
      radical: studentPayment?.radical || 'FULL_YEAR',
      prefix: studentPayment ? studentPayment.prefix : 'P',
      suffixLength: studentPayment?.suffixLength || 4,
      resetNumberOrder: studentPayment ? studentPayment.resetNumberOrder : true,
      paymentGroupCompulsory: studentPayment
        ? studentPayment.paymentGroupCompulsory
        : false,
      schoolFeeCompulsory: studentPayment
        ? studentPayment.schoolFeeCompulsory
        : false,
      uniqueInvoice: studentPayment ? studentPayment.uniqueInvoice : true,
      bigSizeReceipt: studentPayment ? studentPayment.bigSizeReceipt : false,
      leftSignature: studentPayment ? studentPayment.leftSignature : '',
      rightSignature: studentPayment ? studentPayment.rightSignature : '',
      middleSignature: studentPayment ? studentPayment.middleSignature : '',
      showEmptyNonCompulsory: studentPayment
        ? studentPayment.showEmptyNonCompulsory
        : true,

      forceClassChange: studentPayment
        ? studentPayment.forceClassChange
        : false,
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode({
        ...values,
        radical: values.radical,
        prefix: values.prefix,
        suffixLength: Number(values.suffixLength),
        resetNumberOrder: values.resetNumberOrder,
      })
      //console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: {
              key: 'StudentPayment',
              enterpriseId: enterpriseId,
            },
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Configuration effectuée`, { ...TOAST_OPTIONS })
          setSchoolFeeCompulsory(values.schoolFeeCompulsory)
          if (onCancel) {
            onCancel()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible de modifier la configuration: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <FormContainer>
        {/* Numbering Configuration Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Hash size={16} />
            </SectionIcon>
            <SectionTitle>Configuration de numérotation</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="prefix"
                label={t('label-prefix')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="radical"
                label={t('label-radicalType')}
                control={control}
                type="select"
              >
                <option value={'SHORT_YEAR'}>{dayjs().format('YY')}</option>
                <option value={'FULL_YEAR'}>{dayjs().format('YYYY')}</option>
              </Input>
            </FieldGroup>
            <FieldGroup>
              <Input
                name="suffixLength"
                label={t('label-suffixLength')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="resetNumberOrder"
                  label={t('label-resetNumberOrder')}
                  control={control}
                  defaultChecked={getValues('resetNumberOrder')}
                />
              </SwitchWrapper>
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Payment Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <CreditCard size={16} />
            </SectionIcon>
            <SectionTitle>Paramètres de paiement</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="paymentGroupCompulsory"
                  label={t('label-paymentGroupCompulsory')}
                  control={control}
                  defaultChecked={getValues('paymentGroupCompulsory')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="schoolFeeCompulsory"
                  label={t('label-schoolFeeCompulsory')}
                  control={control}
                  defaultChecked={getValues('schoolFeeCompulsory')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="uniqueInvoice"
                  label={t('label-uniqueInvoice')}
                  control={control}
                  defaultChecked={getValues('uniqueInvoice')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="bigSizeReceipt"
                  label={t('label-bigSizeReceipt')}
                  control={control}
                  defaultChecked={getValues('bigSizeReceipt')}
                />
              </SwitchWrapper>
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Signatures Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <AlignLeft size={16} />
            </SectionIcon>
            <SectionTitle>Signatures</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={3}>
            <FieldGroup>
              <Input
                name="leftSignature"
                label={t('label-leftSignature')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="middleSignature"
                label={t('label-middleSignature')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="rightSignature"
                label={t('label-rightSignature')}
                control={control}
              />
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Display Options Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Eye size={16} />
            </SectionIcon>
            <SectionTitle>Options d'affichage</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="showEmptyNonCompulsory"
                  label={t('label-showEmptyNonCompulsory')}
                  control={control}
                  defaultChecked={getValues('showEmptyNonCompulsory')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="forceClassChange"
                  label={t('label-forceClassChange')}
                  control={control}
                  defaultChecked={getValues('forceClassChange')}
                />
              </SwitchWrapper>
            </FieldGroup>
          </FieldGrid>
        </Section>
      </FormContainer>

      <ActionButtons
        cancelAction={onCancel}
        isSubmitting={props.loading}
        popover={true}
        dirty={isDirty}
        onSubmit={onSubmit}
        saveLabel={studentPayment ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default StudentPaymentConfigForm
