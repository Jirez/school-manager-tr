import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeDuplicatedStudentDocument } from '@/gql/graphql'
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
import { ShieldCheck, User } from 'lucide-react'

interface DuplicatedStudentType {
  verifyDuplicatedStudent: boolean
  includeLastName: boolean
  includeFirstName: boolean
  includeBirthDate: boolean
  includeBirthplace: boolean
  includeGender: boolean
}

interface Props {
  duplicatedStudent?: DuplicatedStudentType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const DuplicatedStudentForm: FC<Props> = ({
  duplicatedStudent,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeDuplicatedStudentDocument,
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
  } = useForm<DuplicatedStudentType>({
    defaultValues: {
      verifyDuplicatedStudent:
        duplicatedStudent?.verifyDuplicatedStudent || false,
      includeLastName: duplicatedStudent?.includeLastName || true,
      includeFirstName: duplicatedStudent?.includeFirstName || true,
      includeBirthDate: duplicatedStudent?.includeBirthDate || false,
      includeBirthplace: duplicatedStudent?.includeBirthplace || false,
      includeGender: duplicatedStudent?.includeGender || true,
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode(values)
      // console.log(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: {
              key: 'DuplicatedStudent',
              enterpriseId: enterpriseId,
            },
          },
        },
      })
        .then(async ({ data }) => {
          // form.resetFields();
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
        {/* General Settings Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <ShieldCheck size={16} />
            </SectionIcon>
            <SectionTitle>Paramètres généraux</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="verifyDuplicatedStudent"
                  label={t('label-verifyDuplicatedStudent')}
                  control={control}
                  defaultChecked={getValues('verifyDuplicatedStudent')}
                />
              </SwitchWrapper>
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Criteria to Include Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <User size={16} />
            </SectionIcon>
            <SectionTitle>Critères à inclure</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="includeLastName"
                  label={t('label-includeLastName')}
                  control={control}
                  defaultChecked={getValues('includeLastName')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="includeFirstName"
                  label={t('label-includeFirstName')}
                  control={control}
                  defaultChecked={getValues('includeFirstName')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="includeBirthDate"
                  label={t('label-includeBirthDate')}
                  control={control}
                  defaultChecked={getValues('includeBirthDate')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="includeBirthplace"
                  label={t('label-includeBirthplace')}
                  control={control}
                  defaultChecked={getValues('includeBirthplace')}
                />
              </SwitchWrapper>
            </FieldGroup>
            <FieldGroup>
              <SwitchWrapper>
                <Switch
                  name="includeGender"
                  label={t('label-includeGender')}
                  control={control}
                  defaultChecked={getValues('includeGender')}
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
        saveLabel={duplicatedStudent ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default DuplicatedStudentForm
