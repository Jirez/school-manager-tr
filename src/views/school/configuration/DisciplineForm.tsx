import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeDisciplineDocument } from '@/gql/graphql'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
} from './config-form-helper'
import { AlertTriangle, XCircle } from 'lucide-react'

interface DisciplineType {
  warning: string
  blame: string
  exclusion3: string
  exclusion5: string
  exclusion8: string
  definitiveExclusion: string
}

interface DisciplineFormProps {
  discipline?: DisciplineType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const DisciplineForm: FC<DisciplineFormProps> = ({
  discipline,
  action,
  onCancel,
  ...props
}) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeDisciplineDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<DisciplineType>({
    defaultValues: {
      warning: discipline?.warning || '',
      blame: discipline?.blame || '',
      exclusion3: discipline?.exclusion3 || '',
      exclusion5: discipline?.exclusion5 || '',
      exclusion8: discipline?.exclusion8 || '',
      definitiveExclusion: discipline?.definitiveExclusion || '',
    },
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: { key: 'Discipline', enterpriseId: enterpriseId },
          },
        },
      })
        .then(async ({ data }) => {
          // form.resetFields();
          toast.success(`Discipline personnalisée`, { ...TOAST_OPTIONS })
          if (onCancel) {
            onCancel()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible de configurer la discipline: ${formatError(error)}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <FormContainer>
        {/* Light Sanctions Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <AlertTriangle size={16} />
            </SectionIcon>
            <SectionTitle>Sanctions légères</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="warning"
                label={t('label-warning')}
                control={control}
                required
                placeholder="Ex: 1-5"
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="blame"
                label={t('label-blame')}
                control={control}
                required
              />
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Exclusions Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <XCircle size={16} />
            </SectionIcon>
            <SectionTitle>Exclusions</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="exclusion3"
                label={t('label-exclusion3')}
                control={control}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="exclusion5"
                label={t('label-exclusion5')}
                control={control}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="exclusion8"
                label={t('label-exclusion8')}
                control={control}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="definitiveExclusion"
                label={t('label-definitiveExclusion')}
                control={control}
                required
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
      />
    </Form>
  )
}

export default DisciplineForm
