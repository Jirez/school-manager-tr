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
import { EncodeDocumentHeaderDocument } from '@/gql/graphql'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
} from './config-form-helper'
import { FileText, MapPin } from 'lucide-react'

interface DocumentHeaderType {
  leftHeader: string
  rightHeader: string
  regionalDelegation: string
  departmentalDelegation: string
}

interface DocumentHeaderFormProps {
  documentHeader?: DocumentHeaderType
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
}

const DocumentHeaderForm: FC<DocumentHeaderFormProps> = ({
  documentHeader,
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
  } = useForm<DocumentHeaderType>({
    defaultValues: {
      leftHeader: documentHeader?.leftHeader || '',
      rightHeader: documentHeader?.rightHeader || '',
      regionalDelegation: documentHeader?.regionalDelegation || '',
      departmentalDelegation: documentHeader?.departmentalDelegation || '',
    },
  })

  const encode = async (json: any) => {
    const { data } = await client.query({
      query: EncodeDocumentHeaderDocument,
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
            configurationPK: { key: 'DocumentHeader', enterpriseId },
          },
        },
      })
        .then(async ({ data }) => {
          // form.resetFields();
          toast.success(`Entête de document personnalisé`, {
            ...TOAST_OPTIONS,
          })
          props.onCancel?.()
        })
        .catch((error) => {
          toast.error(
            `Impossible de personnaliser l'entête des documents: ${formatError(
              error,
            )}`,
          )
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <FormContainer>
        {/* Headers Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <FileText size={16} />
            </SectionIcon>
            <SectionTitle>En-têtes de document</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="leftHeader"
                label={t('label-leftHeader')}
                control={control}
                type="textarea"
                required
                rows={12}
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="rightHeader"
                label={t('label-rightHeader')}
                control={control}
                type="textarea"
                required
                rows={12}
              />
            </FieldGroup>
          </FieldGrid>
        </Section>

        {/* Delegations Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <MapPin size={16} />
            </SectionIcon>
            <SectionTitle>Délégations</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={2}>
            <FieldGroup>
              <Input
                name="regionalDelegation"
                label={t('label-regionalDelegation')}
                control={control}
                required
              />
            </FieldGroup>
            <FieldGroup>
              <Input
                name="departmentalDelegation"
                label={t('label-departmentalDelegation')}
                control={control}
                required
              />
            </FieldGroup>
          </FieldGrid>
        </Section>
      </FormContainer>

      <ActionButtons
        cancelAction={props.onCancel}
        //isSubmitting={props.loading}
        popover={true}
        dirty={isDirty}
        onSubmit={onSubmit}
        saveLabel={documentHeader ? t('label-update') : t('label-save')}
      />
    </Form>
  )
}

export default DocumentHeaderForm
