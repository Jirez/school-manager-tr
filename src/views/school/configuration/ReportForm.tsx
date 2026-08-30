import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import { Form } from 'reactstrap'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeReportDocument } from '@/gql/graphql'
import { useTranslation } from 'react-i18next'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
} from './config-form-helper'
import { Percent, Calendar } from 'lucide-react'

interface FormValues {
  minSubjectsPercentage: number | string
  annualSubPeriodsRequired: number | string
  quarterlySubPeriodsRequired: number | string
}

interface ReportFormProps {
  report?: FormValues
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

const ReportForm: FC<ReportFormProps> = ({ report, action, ...props }) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeReportDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      minSubjectsPercentage: report?.minSubjectsPercentage || '',
      annualSubPeriodsRequired: report?.annualSubPeriodsRequired || '',
      quarterlySubPeriodsRequired: report?.quarterlySubPeriodsRequired || '',
    },
    resolver: yupResolver(
      yup.object({
        minSubjectsPercentage: yup.number().min(0).max(100).required(),
        annualSubPeriodsRequired: yup.number().min(1).max(6).required(),
        quarterlySubPeriodsRequired: yup.number().min(1).max(2).required(),
      }),
    ) as any,
  })

  const onSubmit = async (values: any) => {
    const data = await encode(values)

    action?.({
      variables: {
        config: {
          configData: data.configData,
          configurationPK: { key: 'Report', enterpriseId },
        },
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Configuration des bulletins de notes effectuée`, {
          ...TOAST_OPTIONS,
        })
        if (props.onCancel) {
          props.onCancel()
        }
      })
      .catch((error) => {
        toast.error(
          `Impossible de configurer les bulletins de notes: ${formatError(
            error,
          )}`,
        )
      })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-0">
      <FormContainer>
        {/* Sequential Classification Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Percent size={16} />
            </SectionIcon>
            <SectionTitle>Classification séquentielle</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <Input
                name="minSubjectsPercentage"
                control={control}
                label={
                  'Pourcentage de matière minimum nécessaire à un élèves pour être classé séquentiellement'
                }
                required
              />
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Periodic Classification Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Calendar size={16} />
            </SectionIcon>
            <SectionTitle>Classification périodique</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="annualSubPeriodsRequired"
                control={control}
                label={
                  'Nombre de séquences requises pour être classé annuellement'
                }
                required
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="quarterlySubPeriodsRequired"
                control={control}
                label={
                  'Nombre de séquences requises pour être classé trimestriellement'
                }
                required
              />
            </FieldGroup>
          </FieldGrid>
        </Section>
      </FormContainer>

      <ActionButtons
        cancelAction={props.onCancel}
        isSubmitting={props.loading}
        popover={true}
        dirty={isDirty}
        onSubmit={onSubmit}
        saveLabel={report ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default ReportForm
