import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeSecurityDocument } from '@/gql/graphql'
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
import { Shield, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react'

interface SecurityType {
  enableSecuredLogin: boolean
  type: 'WEAK' | 'MEDIUM' | 'NORMAL' | 'HIGH'
}

interface SecurityFormProps {
  security?: SecurityType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const SecurityForm: FC<SecurityFormProps> = ({
  security,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeSecurityDocument,
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
  } = useForm<SecurityType>({
    defaultValues: {
      enableSecuredLogin: security ? security.enableSecuredLogin : true,
      type: security ? security.type : 'HIGH',
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode(values)
      //console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: { key: 'Security', enterpriseId: enterpriseId },
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Configuration de la sécurité terminée`, {
            ...TOAST_OPTIONS,
          })
          if (onCancel) {
            onCancel()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible de paramétrer la sécurité: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <FormContainer>
        {/* General Security Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Shield size={16} />
            </SectionIcon>
            <SectionTitle>Paramètres de sécurité</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="enableSecuredLogin"
                  label={t('label-enableSecuredLogin')}
                  control={control}
                  defaultChecked={getValues('enableSecuredLogin')}
                />
              </SwitchWrapper>
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Security Level Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <ShieldCheck size={16} />
            </SectionIcon>
            <SectionTitle>Niveau de sécurité</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <OptionLabel>{t('label-loginSecurityType')} *</OptionLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioCardGroup>
                    <RadioCard
                      $selected={field.value === 'WEAK'}
                      onClick={() => field.onChange('WEAK')}
                    >
                      <input
                        type="radio"
                        value="WEAK"
                        checked={field.value === 'WEAK'}
                        onChange={() => field.onChange('WEAK')}
                      />
                      <RadioCardIcon $selected={field.value === 'WEAK'}>
                        <ShieldOff size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'WEAK'}>
                        {t('label-loginSecurityTypeWeak')}
                      </RadioCardTitle>
                    </RadioCard>
                    <RadioCard
                      $selected={field.value === 'MEDIUM'}
                      onClick={() => field.onChange('MEDIUM')}
                    >
                      <input
                        type="radio"
                        value="MEDIUM"
                        checked={field.value === 'MEDIUM'}
                        onChange={() => field.onChange('MEDIUM')}
                      />
                      <RadioCardIcon $selected={field.value === 'MEDIUM'}>
                        <ShieldAlert size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'MEDIUM'}>
                        {t('label-loginSecurityTypeMedium')}
                      </RadioCardTitle>
                    </RadioCard>
                    <RadioCard
                      $selected={field.value === 'HIGH'}
                      onClick={() => field.onChange('HIGH')}
                    >
                      <input
                        type="radio"
                        value="HIGH"
                        checked={field.value === 'HIGH'}
                        onChange={() => field.onChange('HIGH')}
                      />
                      <RadioCardIcon $selected={field.value === 'HIGH'}>
                        <ShieldCheck size={20} />
                      </RadioCardIcon>
                      <RadioCardTitle $selected={field.value === 'HIGH'}>
                        {t('label-loginSecurityTypeHigh')}
                      </RadioCardTitle>
                    </RadioCard>
                  </RadioCardGroup>
                )}
              />
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
        saveLabel={security ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default SecurityForm
