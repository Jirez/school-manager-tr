import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import { EncodeReportHeaderDocument } from '@/gql/graphql'

interface ReportHeaderType {
  leftHeader: string
  rightHeader: string
}

interface ReportHeaderFormProps {
  reportHeader?: ReportHeaderType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
}

const ReportHeaderForm: FC<ReportHeaderFormProps> = ({
  reportHeader,
  action,
  // onCancel,
  ...props
}) => {
  const { t } = useTranslation()
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ReportHeaderType>({
    defaultValues: {
      leftHeader: reportHeader?.leftHeader || '',
      rightHeader: reportHeader?.rightHeader || '',
    },
  })

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeReportHeaderDocument,
      variables: { json },
      fetchPolicy: 'network-only',
    })

    return data
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const data = await encode(values)

      action?.({
        variables: {
          config: {
            configData: data.configData,
            configurationPK: { key: 'ReportHeader', enterpriseId },
          },
        },
      })
        .then(async ({ data }) => {
          // form.resetFields();
          toast.success(`Entête de bulletins de notes personnalisé`, {
            ...TOAST_OPTIONS,
          })
          props.onCancel?.()
        })
        .catch((error) => {
          toast.error(
            `Impossible de personnaliser l'entête des bulletins de notes: ${formatError(
              error,
            )}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <div className="flex flex-col md:flex-row gap-6">
        <Input
          name="leftHeader"
          label={t('label-leftHeader')}
          control={control}
          type="textarea"
          required
          className="w-full md:w-6/12"
          rows={12}
        />

        <Input
          name="rightHeader"
          label={t('label-rightHeader')}
          control={control}
          type="textarea"
          required
          className="w-full md:w-6/12"
          rows={12}
        />
      </div>

      <ActionButtons
        cancelAction={props.onCancel}
        //isSubmitting={props.loading}
        popover={true}
        dirty={isDirty}
        onSubmit={onSubmit}
        saveLabel={reportHeader ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default ReportHeaderForm
