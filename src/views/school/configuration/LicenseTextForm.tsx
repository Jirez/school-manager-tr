import type { FC } from 'react'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { Form } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  EncodeLicenseDocument,
  LoadLicenseFromTextDocument,
} from '@/gql/graphql'
import {
  FormContainer,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  FieldGrid,
  FieldGroup,
} from './config-form-helper'
import { Key } from 'lucide-react'

interface LicenseTextFormProps {
  onCancel?: () => void
  action?: (variables: any) => Promise<any>
  loading?: boolean
}

interface FormValues {
  licenseText: string
}

const LicenseTextForm: FC<LicenseTextFormProps> = (props) => {
  const client = useApolloClient()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()

  const encode = async (json: any) => {
    // @ts-ignore desc
    const { data } = await client
      .query({
        query: EncodeLicenseDocument,
        variables: { json },
        fetchPolicy: 'network-only',
      })
      .catch((e) => toast.error('Licence invalide'))

    return data
  }

  const load = async (text: string) => {
    // @ts-ignore desc
    const { data } = await client
      .query({
        query: LoadLicenseFromTextDocument,
        variables: { base64Text: text },
        fetchPolicy: 'network-only',
      })
      .catch((e) => toast.error(`Licence invalide : ${formatError(e)}`))

    return data
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      licenseText: '',
    },
    resolver: yupResolver(
      yup.object({
        licenseText: yup.string().required(),
      }),
    ),
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const licenseJson = await load(values.licenseText)
      const license = licenseJson ? licenseJson.license : null

      const data = license
        ? await encode({
            licenseKey: license.licenseKey,
            enterpriseName: license.enterpriseName,
            expiryDate: license.expiryDate, // dayjs(license.expiryDate).format("DD/MM/YYYY"),
            enterpriseId: Number(license.enterpriseId),
            schoolYearId: Number(license.schoolYearId),
            subPeriods: license.subPeriods,
          })
        : null

      if (!data) {
        toast.error('Votre licence est invalide')
        return
      }

      props
        .action?.({
          variables: {
            config: {
              configData: data.configData,
              configurationPK: { key: 'License', enterpriseId: enterpriseId },
            },
          },
        })
        .then(async ({ data }) => {
          toast.success(`Licence enregistrée`, { ...TOAST_OPTIONS })
          props.onCancel?.()
        })
        .catch((error) => {
          toast.error(`Impossible d'enregistrer la licence: ${error.message}`)
        })
    })(event)
  }

  return (
    <Form onSubmit={onSubmit} className="p-0">
      <FormContainer>
        {/* License Text Section */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <Key size={16} />
            </SectionIcon>
            <SectionTitle>Configuration de la licence</SectionTitle>
          </SectionHeader>
          <FieldGrid $columns={1}>
            <FieldGroup>
              <Input
                name="licenseText"
                control={control}
                label={t('label-licenseText')}
                type="textarea"
                rows={6}
                placeholder={t('label-pasteLicense')}
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
      />
    </Form>
  )
}

export default LicenseTextForm
