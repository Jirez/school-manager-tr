import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodePersonnelCodeDocument } from '@/gql/graphql'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
  SwitchWrapper,
  RadioCardGroup,
  RadioCard,
  RadioCardIcon,
  RadioCardTitle,
  OptionLabel,
} from './config-form-helper'
import {
  Hash,
  Type,
  Ruler,
  Calendar,
  CalendarDays,
  X,
  School,
  User,
} from 'lucide-react'

interface PersonnelCodetYpe {
  prefix: 'SHORT_YEAR' | 'FULL_YEAR' | 'NONE'
  prefixSep: string
  radicalType: 'SCHOOL_CODE' | 'STUDENT_INITIAL'
  radicalLength?: number
  radicalFill?: string
  postRadical?: string
  suffixLength: number
  resetNumberOrder: boolean
  randomSuffix: boolean
}

interface Props {
  registrationNumber?: PersonnelCodetYpe
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const PersonnelCodeForm: FC<Props> = ({
  registrationNumber,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodePersonnelCodeDocument,
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
  } = useForm<PersonnelCodetYpe>({
    defaultValues: {
      prefix: registrationNumber?.prefix || 'SHORT_YEAR',
      prefixSep: registrationNumber ? registrationNumber.prefixSep : '_',
      postRadical: registrationNumber ? registrationNumber.postRadical : 'EM',
      radicalType: registrationNumber?.radicalType || 'SCHOOL_CODE',
      radicalLength: registrationNumber?.radicalLength || 0,
      radicalFill: registrationNumber?.radicalFill || 'X',
      suffixLength: registrationNumber?.suffixLength || 4,
      resetNumberOrder: registrationNumber
        ? registrationNumber.resetNumberOrder
        : true,
      randomSuffix: registrationNumber
        ? registrationNumber.randomSuffix
        : false,
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode({
        ...values,
        radicalLength: Number(values.radicalLength),
        suffixLength: Number(values.suffixLength),
      })
      //console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: {
              key: 'PersonnelCode',
              enterpriseId: enterpriseId,
            },
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Configuration effectuée`, { ...TOAST_OPTIONS })
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
        {/* Prefix Configuration Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Hash size={16} />
            </SectionIcon>
            <SectionTitle>Configuration du préfixe</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <OptionLabel>{t('label-prefix')} *</OptionLabel>
              <Controller
                name="prefix"
                control={control}
                render={({ field }) => (
                  <RadioCardGroup>
                    <RadioCard
                      $selected={field.value === 'SHORT_YEAR'}
                      onClick={() => field.onChange('SHORT_YEAR')}
                    >
                      <input
                        type="radio"
                        value="SHORT_YEAR"
                        checked={field.value === 'SHORT_YEAR'}
                        onChange={() => field.onChange('SHORT_YEAR')}
                      />
                      <RadioCardIcon $selected={field.value === 'SHORT_YEAR'}>
                        <Calendar size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'SHORT_YEAR'}>
                        {t('label-shortYear')}
                      </RadioCardTitle>
                    </RadioCard>
                    <RadioCard
                      $selected={field.value === 'FULL_YEAR'}
                      onClick={() => field.onChange('FULL_YEAR')}
                    >
                      <input
                        type="radio"
                        value="FULL_YEAR"
                        checked={field.value === 'FULL_YEAR'}
                        onChange={() => field.onChange('FULL_YEAR')}
                      />
                      <RadioCardIcon $selected={field.value === 'FULL_YEAR'}>
                        <CalendarDays size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'FULL_YEAR'}>
                        {t('label-fullYear')}
                      </RadioCardTitle>
                    </RadioCard>
                    <RadioCard
                      $selected={field.value === 'NONE'}
                      onClick={() => field.onChange('NONE')}
                    >
                      <input
                        type="radio"
                        value="NONE"
                        checked={field.value === 'NONE'}
                        onChange={() => field.onChange('NONE')}
                      />
                      <RadioCardIcon $selected={field.value === 'NONE'}>
                        <X size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'NONE'}>
                        {t('label-none')}
                      </RadioCardTitle>
                    </RadioCard>
                  </RadioCardGroup>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="prefixSep"
                label={t('label-prefixSep')}
                control={control}
              />
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Radical Configuration Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Type size={16} />
            </SectionIcon>
            <SectionTitle>Configuration du radical</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup $span={2}>
              <OptionLabel>{t('label-radicalType')} *</OptionLabel>
              <Controller
                name="radicalType"
                control={control}
                render={({ field }) => (
                  <RadioCardGroup>
                    <RadioCard
                      $selected={field.value === 'SCHOOL_CODE'}
                      onClick={() => field.onChange('SCHOOL_CODE')}
                    >
                      <input
                        type="radio"
                        value="SCHOOL_CODE"
                        checked={field.value === 'SCHOOL_CODE'}
                        onChange={() => field.onChange('SCHOOL_CODE')}
                      />
                      <RadioCardIcon $selected={field.value === 'SCHOOL_CODE'}>
                        <School size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'SCHOOL_CODE'}>
                        {t('label-schoolCode')}
                      </RadioCardTitle>
                    </RadioCard>
                    <RadioCard
                      $selected={field.value === 'STUDENT_INITIAL'}
                      onClick={() => field.onChange('STUDENT_INITIAL')}
                    >
                      <input
                        type="radio"
                        value="STUDENT_INITIAL"
                        checked={field.value === 'STUDENT_INITIAL'}
                        onChange={() => field.onChange('STUDENT_INITIAL')}
                      />
                      <RadioCardIcon
                        $selected={field.value === 'STUDENT_INITIAL'}
                      >
                        <User size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle
                        $selected={field.value === 'STUDENT_INITIAL'}
                      >
                        {t('label-studentInitial')}
                      </RadioCardTitle>
                    </RadioCard>
                  </RadioCardGroup>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="radicalLength"
                label={t('label-radicalLength')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="radicalFill"
                label={t('label-radicalFill')}
                control={control}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="postRadical"
                label={t('label-postRadical')}
                control={control}
              />
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Suffix Configuration Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Ruler size={16} />
            </SectionIcon>
            <SectionTitle>Configuration du suffixe</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
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
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="randomSuffix"
                  label={t('label-randomSuffix')}
                  control={control}
                  defaultChecked={getValues('randomSuffix')}
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
        saveLabel={registrationNumber ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default PersonnelCodeForm
